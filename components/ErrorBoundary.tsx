"use client";

// Catches render-time crashes in the interactive client islands (the graph
// explorer, the daily spotlight) so a single JS error degrades to a small
// message instead of blanking the page. Adapted from the wikidata-explorer
// reference's ErrorBoundary.
import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <p className="related-status">
            Something went wrong loading this view. Please reload the page.
          </p>
        )
      );
    }
    return this.props.children;
  }
}
