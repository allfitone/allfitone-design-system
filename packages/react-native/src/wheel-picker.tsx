/**
 * A run of values that turns under a fixed window.
 *
 * The control every "pick one number out of a run of them" screen wants. The reading
 * is not a label above a ruler — it **is** the entry sitting in the window, so the
 * number and the act of choosing it are one object instead of two that have to be kept
 * in agreement.
 *
 * **It is a `ScrollView`, not a pan gesture.** A wheel is scrolling, and saying so
 * hands over momentum, rubber-banding, the platform's own fling curve and
 * accessibility scrolling for free; `snapToInterval` is what makes the detents exact.
 * A hand-rolled pan would have to re-earn all of it and would still come to rest
 * differently from every other scroll on the phone.
 *
 * **Three tiers, not a continuous ramp.** Distance from the window drives size and
 * colour in steps — chosen, adjacent, far — because interpolating `fontSize` per frame
 * cannot run on the native driver, and it would drag the scroll back onto the
 * JavaScript thread exactly while the finger is moving fastest. The tiers change only
 * when the selection does, which is also the only moment the eye is on them.
 *
 * **The window is two ticks, and nothing between them.** A filled band with a rule
 * either side draws a second object around the reading and turns the wheel into a
 * table; the pair of ticks says where the reading is and gets out of its way.
 *
 * **The ends fade by dimming the far pair, not by painting the page.** A gradient in
 * the page's colour is a claim about what the page is, and over anything but a flat
 * fill — a photograph, an ambient wash — that claim arrives as a rectangle sitting on
 * top of the design. Dimming and letting the frame cut the far pair reads the same and
 * survives whatever the wheel is standing on.
 *
 * **Both orientations are one control on purpose.** A horizontal weight beside a
 * vertical height is a deliberate pairing — the scales differ in how far they run, not
 * in what they are — and two components would let their detents, tiers and
 * accessibility drift apart the first time one of them was touched.
 *
 * **The unit travels with its reading.** Parked as an overlay in the middle of the
 * frame it would sit on top of whatever passes through the window mid-scroll; inside
 * the chosen cell it is part of the thing it names and can never cover anything.
 *
 * **No haptics here.** `onChange` fires once per detent, which is where a tick belongs,
 * but the tick is the consumer's — so this package takes no native dependency for it.
 */

import { memo, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type WheelOrientation = "vertical" | "horizontal";

/**
 * One cell, and the size of the window that holds the chosen one.
 *
 * The horizontal cell is wider than the vertical one is tall because a run laid across
 * has the room and a three-digit reading has to fit beside its neighbours without
 * touching them.
 */
const CELL: Record<WheelOrientation, number> = { vertical: 44, horizontal: 78 };

/**
 * Vertical is four cells tall, which shows five values: the window, one whole row
 * either side, and the far pair cut in half by the frame. Horizontal is shorter than
 * its cells are wide — a run across only needs to clear the tallest reading.
 */
const EXTENT: Record<WheelOrientation, number> = { vertical: 44 * 4, horizontal: 112 };

/** The chosen reading is a shade larger lying down, where nothing is stacked above it. */
const CHOSEN_SIZE: Record<WheelOrientation, number> = { vertical: 36, horizontal: 38 };

const NEAR_SIZE = 26;
const FAR_SIZE = 20;

/** How far the far pair is taken down before the frame cuts it. */
const FAR_OPACITY = 0.55;

/** The two ticks: long across the run, short along it. */
const TICK_LONG = 16;
const TICK_SHORT = 3;
const TICK_INSET = 14;

/** The gap between the reading and its unit. */
const SUFFIX_GAP = 6;


export type WheelPickerProps = {
  /** Ascending, and every entry reachable: the wheel does not skip. */
  readonly values: readonly number[];
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly orientation?: WheelOrientation;
  /** Drawn beside the chosen entry, e.g. `kg`. Never announced — the label says it. */
  readonly suffix?: string;
  /** For runs whose label is not the number, such as total inches drawn as feet. */
  readonly formatValue?: (value: number) => string;
  /** Names the wheel for a screen reader. Required: a bare run of numbers is mute. */
  readonly accessibilityLabel: string;
  /** What the chosen entry means out loud, e.g. `70 kilos`. Defaults to the label. */
  readonly accessibilityText?: string;
  readonly disabled?: boolean;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function WheelPicker({
  values,
  value,
  onChange,
  orientation = "vertical",
  suffix,
  formatValue,
  accessibilityLabel,
  accessibilityText,
  disabled,
  testID,
  style,
}: WheelPickerProps) {
  const theme = useTheme();
  const scroller = useRef<ScrollView>(null);
  // Mirrors the scroll position as an index. In state rather than a ref because it is
  // what the three tiers are drawn from.
  const [shown, setShown] = useState(() => clamp(values.indexOf(value), values.length));
  // A run laid across has to know how wide its frame is before it can say where the
  // middle of it falls; standing up, the extent is fixed and there is nothing to ask.
  const [span, setSpan] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [unitWidth, setUnitWidth] = useState(0);
  // Starts unsynced on purpose: the first run of the effect below is what puts the
  // wheel on the chosen entry, and a wheel that opens at the end of its scale is a
  // wheel that answered a question nobody asked.
  const synced = useRef(-1);

  const across = orientation === "horizontal";
  const cell = CELL[orientation];
  const extent = EXTENT[orientation];
  const chosen = clamp(values.indexOf(value), values.length);
  const label = (entry: number) => (formatValue ? formatValue(entry) : String(entry));
  const lead = across ? Math.max(0, (span - cell) / 2) : (extent - cell) / 2;
  const ready = !across || span > 0;

  // Follows the value when something *other than a scroll* moves it: switching unit
  // rebuilds the whole run, and the window would otherwise keep the old offset.
  //
  // The ref is what makes that "other than": keyed on the values array instead, a
  // caller that builds its run inline hands over a new identity every render, and the
  // effect would haul the wheel back to the chosen entry in the middle of a drag.
  useEffect(() => {
    if (!ready || synced.current === chosen) return;
    synced.current = chosen;
    setShown(chosen);
    const to = chosen * cell;
    scroller.current?.scrollTo(across ? { x: to } : { y: to });
  }, [chosen, ready, across, cell]);

  const indexAt = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset;
    return clamp(Math.round((across ? offset.x : offset.y) / cell), values.length);
  };

  const settle = (event: NativeSyntheticEvent<NativeScrollEvent>, still: boolean) => {
    const landed = indexAt(event);
    // Claimed before the value comes back, or the effect above would read the scroll's
    // own result as somebody else moving the wheel.
    synced.current = landed;
    if (still) setSpinning(false);
    setShown(landed);
    const picked = values[landed];
    if (picked !== undefined && picked !== value) onChange(picked);
  };

  // Letting go is not stopping. A release with any speed left carries on gliding to its
  // detent, and calling that still puts the unit back on screen mid-glide — which is
  // the covering this was meant to end.
  const released = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const speed = event.nativeEvent.velocity;
    const gliding = Math.abs((across ? speed?.x : speed?.y) ?? 0) > 0.05;
    settle(event, !gliding);
  };

  // Tracked during the drag too, so the tiers follow the finger rather than snapping
  // into place only once it lifts.
  const track = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const over = indexAt(event);
    if (over !== shown) setShown(over);
  };

  const step = (by: number) => {
    synced.current = -1;
    const next = values[clamp(chosen + by, values.length)];
    if (next !== undefined && next !== value) onChange(next);
  };

  const inkFor = (tier: number) => {
    if (tier === 0) return theme.color.text.primary;
    return tier === 1 ? theme.color.wheel.near : theme.color.wheel.far;
  };

  return (
    <View
      testID={testID}
      onLayout={(event: LayoutChangeEvent) => setSpan(event.nativeEvent.layout.width)}
      style={[styles.base, { height: extent }, style]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: accessibilityText ?? label(value) }}
      accessibilityState={{ disabled: disabled === true }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) => {
        if (disabled) return;
        step(event.nativeEvent.actionName === "increment" ? 1 : -1);
      }}
    >
      {ready ? (
        <ScrollView
          ref={scroller}
          horizontal={across}
          scrollEnabled={disabled !== true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={cell}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={track}
          onScrollBeginDrag={() => setSpinning(true)}
          onMomentumScrollEnd={(event) => settle(event, true)}
          onScrollEndDrag={released}
          contentContainerStyle={across ? { paddingHorizontal: lead } : { paddingVertical: lead }}
          contentOffset={across ? { x: chosen * cell, y: 0 } : { x: 0, y: chosen * cell }}
          importantForAccessibility="no-hide-descendants"
        >
          {values.map((entry, index) => (
            <Cell
              key={entry}
              label={label(entry)}
              /* Capped at 2, which is what makes the memo pay: moving one detent
                 re-renders five cells and leaves the rest of the scale alone. */
              tier={Math.min(Math.abs(index - shown), 2)}
              ink={inkFor(Math.min(Math.abs(index - shown), 2))}
              orientation={orientation}
            />
          ))}
        </ScrollView>
      ) : null}

      {/* The unit belongs to the reading that has settled, so it is drawn only when
          one has. Riding along inside the cell it slid about with the digits; parked
          here permanently it sat on top of whatever passed through mid-scroll. Neither
          is a thing a unit does — it names the answer, and during a spin there is no
          answer to name.

          The nudge keeps the reading centred under the ticks: the twin is invisible
          and reserves the digits' width, so the unit lands off their right edge
          whether they are two digits or three. */}
      {suffix && !spinning ? (
        <View pointerEvents="none" style={styles.unitWindow}>
          <View
            style={[
              styles.reading,
              unitWidth > 0 ? { transform: [{ translateX: (unitWidth + SUFFIX_GAP) / 2 }] } : null,
            ]}
          >
            <Text
              role="display"
              size="lg"
              style={[
                styles.ghost,
                { fontSize: CHOSEN_SIZE[orientation], lineHeight: CHOSEN_SIZE[orientation] * 1.2 },
              ]}
            >
              {label(value)}
            </Text>
            <Text
              role="body"
              size="sm"
              onLayout={(event) => setUnitWidth(event.nativeEvent.layout.width)}
              style={[styles.suffix, { color: theme.color.text.muted }]}
            >
              {suffix}
            </Text>
          </View>
        </View>
      ) : null}

      {/* The whole window: two ticks, and nothing between them. */}
      {[true, false].map((leading) => (
        <View
          key={String(leading)}
          pointerEvents="none"
          style={[
            styles.tick,
            { backgroundColor: theme.color.border.accent },
            across
              ? {
                  width: TICK_LONG,
                  height: TICK_SHORT,
                  left: "50%",
                  marginLeft: -TICK_LONG / 2,
                  ...(leading ? { top: TICK_INSET } : { bottom: TICK_INSET }),
                }
              : {
                  width: TICK_SHORT,
                  height: TICK_LONG,
                  top: (extent - TICK_LONG) / 2,
                  ...(leading ? { left: 0 } : { right: 0 }),
                },
          ]}
        />
      ))}
    </View>
  );
}

const Cell = memo(function Cell({
  label,
  tier,
  ink,
  orientation,
}: {
  readonly label: string;
  readonly tier: number;
  readonly ink: string;
  readonly orientation: WheelOrientation;
}) {
  const across = orientation === "horizontal";
  const cell = CELL[orientation];
  const size = sizeFor(tier, orientation);

  return (
    <View style={[styles.cell, across ? { width: cell } : { height: cell }]}>
      <Text
        role="display"
        size="lg"
        style={{
          fontSize: size,
          // Tight to the glyphs: the cell is what centres the reading, so a line box
          // sized to the frame only pushes every reading out of it.
          lineHeight: size * 1.2,
          color: ink,
          opacity: tier === 2 ? FAR_OPACITY : 1,
        }}
      >
        {label}
      </Text>
    </View>
  );
});

function sizeFor(tier: number, orientation: WheelOrientation): number {
  if (tier === 0) return CHOSEN_SIZE[orientation];
  return tier === 1 ? NEAR_SIZE : FAR_SIZE;
}

function clamp(index: number, length: number): number {
  if (!Number.isFinite(index) || index < 0) return 0;
  return Math.min(index, Math.max(0, length - 1));
}

const styles = StyleSheet.create({
  base: { justifyContent: "center", overflow: "hidden" },
  cell: { alignItems: "center", justifyContent: "center" },
  unitWindow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ghost: { opacity: 0 },
  reading: { flexDirection: "row", alignItems: "baseline" },
  suffix: { marginLeft: SUFFIX_GAP },
  tick: { position: "absolute", borderRadius: 2 },
});
