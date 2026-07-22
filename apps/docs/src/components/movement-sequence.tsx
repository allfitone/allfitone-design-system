"use client";

import { Badge } from "@allfitone/react/components/badge";
import { Button } from "@allfitone/react/components/button";
import { Spinner } from "@allfitone/react/components/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@allfitone/react/components/tabs";
import { FoundationIcon } from "@allfitone/react/icons";

const states = [
  { value: "idle", code: "IDL", label: "Idle" },
  { value: "focus", code: "FOC", label: "Focus" },
  { value: "active", code: "ACT", label: "Active" },
  { value: "complete", code: "CMP", label: "Complete" },
] as const;

export function MovementSequence() {
  return (
    <Tabs className="movement-sequence" defaultValue="idle">
      <div className="movement-sequence__label">
        <span>Interaction sequence</span>
        <Badge variant="outline">Keyboard ready</Badge>
      </div>

      <TabsList className="movement-sequence__track" variant="line" aria-label="Interaction states">
        {states.map((state) => (
          <TabsTrigger key={state.value} value={state.value}>
            <span>{state.code}</span>
            {state.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="movement-sequence__stage">
        <TabsContent value="idle">
          <p>Waiting for input</p>
          <Button variant="outline">Record set</Button>
        </TabsContent>
        <TabsContent value="focus">
          <p>Keyboard focus is visible</p>
          <Button className="movement-sequence__forced-focus" variant="outline">Record set</Button>
        </TabsContent>
        <TabsContent value="active">
          <p>Progress is named and announced</p>
          <Button disabled><Spinner label="Recording set" data-icon="inline-start" />Recording set</Button>
        </TabsContent>
        <TabsContent value="complete">
          <p>Outcome is stated beyond color</p>
          <Button variant="secondary"><FoundationIcon name="check" data-icon="inline-start" decorative />Set recorded</Button>
        </TabsContent>
      </div>

      <dl className="movement-sequence__contract">
        <div><dt>Target</dt><dd>44 px</dd></div>
        <div><dt>Baseline</dt><dd>WCAG AA</dd></div>
        <div><dt>Behavior</dt><dd>Base UI</dd></div>
      </dl>
    </Tabs>
  );
}
