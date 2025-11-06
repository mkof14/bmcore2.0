export type StatusItem = {
  key: string;
  label: string;
  required: boolean;
  scope: string;
  present: boolean;
  ok: boolean;
  group: string;
};

export function computeCompletion(groups: { items: StatusItem[] }[]) {
  const items = groups.flatMap(g => g.items);
  const required = items.filter(i => i.required);
  const ok = required.filter(i => i.ok);
  const pct = required.length ? Math.round((ok.length / required.length) * 100) : 100;
  return { total: required.length, ok: ok.length, pct };
}
