// 아이콘은 public/icons/{name}.svg 를 마스크로 써서 색이 글자색(currentColor)을 따른다.
export type IconName =
  | "plus"
  | "pin"
  | "pin-24"
  | "chevron-right"
  | "chevron-left"
  | "share"
  | "more"
  | "note";

export function Icon({ name, size }: { name: IconName; size: number }) {
  const url = `url(/icons/${name}.svg)`;
  return (
    <span
      className="icon"
      aria-hidden="true"
      style={{ width: size, height: size, maskImage: url, WebkitMaskImage: url }}
    />
  );
}
