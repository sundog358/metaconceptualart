"use client";

/*
 * Click-to-zoom deep-zoom viewer for artwork images, adapted from the Artwork of
 * the Day reference's IIIF + OpenSeadragon lightbox. The thumbnail renders
 * normally; clicking it opens a full-screen pan/zoom lightbox. OpenSeadragon is
 * dynamically imported only when the lightbox opens, so it stays out of the
 * initial bundle. Where the work has a IIIF manifest, the lightbox links to it.
 */
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  label?: string;
  manifestHref?: string;
};

export default function ZoomableArtwork({
  src,
  alt,
  className,
  width,
  height,
  label,
  manifestHref,
}: Props) {
  const [open, setOpen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Initialise OpenSeadragon when the lightbox opens; tear it down on close.
  useEffect(() => {
    if (!open || !viewerRef.current) return;
    let viewer: { destroy: () => void } | null = null;
    let active = true;
    import("openseadragon")
      .then((mod) => {
        if (!active || !viewerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const OpenSeadragon = (mod as any).default ?? mod;
        viewer = OpenSeadragon({
          element: viewerRef.current,
          tileSources: { type: "image", url: src },
          showNavigationControl: false,
          gestureSettingsMouse: { clickToZoom: false, scrollToZoom: true },
          maxZoomPixelRatio: 3,
          visibilityRatio: 1,
          constrainDuringPan: true,
          animationTime: 0.4,
          backgroundColor: "transparent",
        });
      })
      .catch(() => {});
    return () => {
      active = false;
      if (viewer) viewer.destroy();
    };
  }, [open, src]);

  // Esc to close, lock background scroll, move focus to the close button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="zoomable"
        onClick={() => setOpen(true)}
        aria-label={"Zoom into " + alt}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={className}
          src={src}
          alt={alt}
          width={width}
          height={height}
        />
        <span className="zoomable-hint" aria-hidden="true">
          ⤢ Zoom
        </span>
      </button>

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={label ?? alt}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="lightbox-bar">
            <span className="lightbox-title">{label ?? alt}</span>
            <span className="lightbox-tools">
              {manifestHref ? (
                <a
                  className="wd-link"
                  href={manifestHref}
                  target="_blank"
                  rel="noopener"
                >
                  IIIF manifest ↗
                </a>
              ) : null}
              <button
                ref={closeRef}
                type="button"
                className="lightbox-close"
                onClick={() => setOpen(false)}
                aria-label="Close zoom view"
              >
                ×
              </button>
            </span>
          </div>
          <div className="lightbox-viewer" ref={viewerRef} />
          <p className="lightbox-hint">
            Scroll or pinch to zoom · drag to pan · Esc to close
          </p>
        </div>
      )}
    </>
  );
}
