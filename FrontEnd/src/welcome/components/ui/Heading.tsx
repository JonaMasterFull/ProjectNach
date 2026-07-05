import { themeClasses } from "../../../lib/themeClasses";

interface HeadingProps {
  line1: string;
  line2: string;
}

export const Heading = ({ line1, line2 }: HeadingProps) => {
  return (
    <h1 className={themeClasses.heading}>
      <span className="block">{line1}</span>
      <span className="block">{line2}</span>
    </h1>
  );
};
