import { ImageResponse } from "next/og";
import { getSiteConfigResult } from "@/lib/config";
import { getServiceBySlug } from "@/lib/routes";
import { getServiceContent } from "@/lib/service-data";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { config: site } = getSiteConfigResult();
  const contentResult = getServiceContent(slug);
  const serviceMeta = getServiceBySlug(slug);

  const heading =
    contentResult?.data?.seo.h1 ??
    serviceMeta?.name ??
    "Licensed Phoenix Plumbing Service";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0B2A4A 0%, #123F6B 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#E6F4FB",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "999px",
                background: "#1E9BD7",
              }}
            />
            <span>{site.brand}</span>
          </div>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              fontSize: "22px",
              fontWeight: 600,
              color: "#BAE6FD",
            }}
          >
            ROC #{site.licensee.rocNumber}
          </div>
        </div>

        <div
          style={{
            fontSize: "58px",
            fontWeight: 700,
            lineHeight: 1.12,
            maxWidth: "980px",
          }}
        >
          {heading}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              padding: "16px 32px",
              borderRadius: "999px",
              background: "#FF7A1A",
              color: "#0B2A4A",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            Call Now · {site.phone.display}
          </div>
          <div style={{ fontSize: "24px", color: "#E6F4FB" }}>
            Phoenix &amp; the Valley, AZ
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

