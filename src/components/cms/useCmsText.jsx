import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useCmsText(key, fallback = "") {
  const { data: blocks = [] } = useQuery({
    queryKey: ["cms-content", key],
    queryFn: () => base44.entities.CmsContent.filter({ key }),
    staleTime: 0, // Always fresh
  });

  const block = blocks[0];
  
  if (!block) {
    return { content: fallback, block: null };
  }

  return {
    content: block.is_draft ? (block.draft_content || block.content) : block.content,
    block,
  };
}