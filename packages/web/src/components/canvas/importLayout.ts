import type { ModelGraph } from "@mc/okf";

/** True when every node carries a position other than the {0,0} default — i.e.
 *  the imported file stored its own layout (e.g. an Ossie file exported from the
 *  canvas) and Dagre must not reshuffle it. Empty graph → false. */
export function hasStoredPositions(g: ModelGraph): boolean {
  return g.nodes.length > 0 && g.nodes.every(n => n.position.x !== 0 || n.position.y !== 0);
}
