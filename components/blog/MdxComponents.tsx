import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";
import { Callout } from "./Callout";
import { Steps, Step } from "./Steps";
import { Checklist, CheckItem } from "./Checklist";
import { Figure } from "./Figure";
import { Diagram } from "./Diagram";
import { DataTable } from "./DataTable";
import { CostTable } from "./CostTable";
import { ProsCons } from "./ProsCons";
import { Definition } from "./Definition";
import { LocalNote } from "./LocalNote";
import { FieldNote } from "./FieldNote";
import { InlineCta } from "./InlineCta";
import { WhenToCall } from "./WhenToCall";
import { SourcesList } from "./SourcesList";
import { AuthorBox } from "./AuthorBox";
import { ReviewerBox } from "./ReviewerBox";
import { HowWeWrite } from "./HowWeWrite";
import { UpdateLog } from "./UpdateLog";
import { PhoneLink } from "@/components/ui/PhoneLink";
import type { SiteConfig } from "@/lib/config";

export function createMdxComponents(site: SiteConfig): MDXComponents {
  return {
    Callout,
    Steps,
    Step,
    Checklist,
    CheckItem,
    Figure,
    Diagram,
    DataTable,
    CostTable,
    ProsCons,
    Definition,
    LocalNote,
    FieldNote,
    InlineCta: (props) => <InlineCta site={site} {...props} />,
    WhenToCall: (props) => <WhenToCall site={site} {...props} />,
    SourcesList,
    AuthorBox,
    ReviewerBox,
    HowWeWrite,
    UpdateLog,
    PhoneLink: (props) => (
      <PhoneLink
        display={site.phone.display}
        e164={site.phone.e164}
        location={props.location || "post-in-body"}
        {...props}
      />
    ),
    a: ({ href, children, ...props }) => {
      const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
      if (isInternal) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children} ↗
        </a>
      );
    },
    table: (props) => (
      <div className="table-scroll-wrapper">
        <table {...props} />
      </div>
    ),
    img: (props) => {
      const { src, alt, width, height, ...rest } = props;
      const parsedW = width ? Number(width) : 800;
      const parsedH = height ? Number(height) : 520;
      const isSvg = typeof src === "string" && src.toLowerCase().endsWith(".svg");
      return (
        <Image
          src={src || ""}
          alt={alt || ""}
          width={!isNaN(parsedW) && parsedW > 0 ? parsedW : 800}
          height={!isNaN(parsedH) && parsedH > 0 ? parsedH : 520}
          unoptimized={isSvg}
          sizes="(max-width: 768px) 100vw, 720px"
          {...rest}
        />
      );
    },
  };
}
