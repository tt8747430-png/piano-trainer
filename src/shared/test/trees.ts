/**
 * What was on the page as a test began: a page its file built as its tests were collected, shared by
 * them, is left as it is.
 */
const kept = new WeakSet<Node>()

/**
 * Watches what a test puts on the page and takes off it; the function it returns takes apart, node
 * from node, every one of those trees no longer on the page. jsdom's selector engine keeps each
 * selector's last context and results for as long as the document lives, every file of a worker
 * (`isolate: false`): a node still joined to its tree would keep the whole page a test drew (a
 * score's thousands of nodes, and through them the app); taken apart, it keeps only itself.
 */
export function watchTrees(): () => void {
  const walker = document.createTreeWalker(document)
  for (let node: Node | null = document; node; node = walker.nextNode()) kept.add(node)
  const trees = new Set<Node>()
  const gather = (records: readonly MutationRecord[]) => {
    for (const record of records) {
      for (const node of record.addedNodes) trees.add(node)
      for (const node of record.removedNodes) trees.add(node)
    }
  }
  const watcher = new MutationObserver(gather)
  watcher.observe(document, { childList: true, subtree: true })
  return () => {
    gather(watcher.takeRecords())
    watcher.disconnect()
    for (const tree of trees) if (!tree.isConnected) takeApart(tree)
    trees.clear()
  }
}

/** A tree's nodes each on their own, the deepest first, but for what was kept. */
function takeApart(tree: Node) {
  const nodes: Node[] = []
  const walker = document.createTreeWalker(tree)
  for (let node: Node | null = tree; node; node = walker.nextNode()) nodes.push(node)
  for (const node of nodes.reverse())
    if (!kept.has(node)) while (node.lastChild) node.removeChild(node.lastChild)
}
