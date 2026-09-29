import { TextLink } from "@/components/ui/editorial";
export default function NotFound() {
  return (
    <div className="shell not-found">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        A page outside
        <br />
        <em>our coverage.</em>
      </h1>
      <p>
        The note you’re looking for may have moved, or the link may be
        incomplete.
      </p>
      <TextLink href="/research">Explore the research library</TextLink>
      <TextLink href="/articles">Browse articles</TextLink>
      <TextLink href="/">Return home</TextLink>
    </div>
  );
}
