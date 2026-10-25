import { useAtomValue, useSetAtom } from "jotai"
import { configFieldsAtomMap } from "@/utils/atoms/config"
import { BUILT_IN_DICTIONARY_ACTION_ID } from "@/utils/constants/custom-action"
import { findSelectionToolbarAction } from "@/utils/custom-actions"
import { cn } from "@/utils/styles/utils"
import { displaySubtitleAtom } from "../atoms"
import { lookUpAtom, subtitleTokensAtom, wordLookupAtom } from "./atoms"

export function SubtitleWordTokens() {
  const cue = useAtomValue(displaySubtitleAtom)
  const tokens = useAtomValue(subtitleTokensAtom)
  const lookup = useAtomValue(wordLookupAtom)
  const selectionToolbar = useAtomValue(configFieldsAtomMap.selectionToolbar)
  const lookUp = useSetAtom(lookUpAtom)
  const dictionary = findSelectionToolbarAction(selectionToolbar, BUILT_IN_DICTIONARY_ACTION_ID)

  if (!dictionary || dictionary.enabled === false) {
    return cue?.text ?? ""
  }

  const lookedUpIndex = lookup && lookup.cueStart === cue?.start ? lookup.index : null

  return (
    <span data-slot="subtitle-line">
      {tokens.map((token, index) =>
        token.isWord ? (
          <span
            // oxlint-disable-next-line react/no-array-index-key -- tokens have no identity beyond their position in the line
            key={index}
            data-slot="subtitle-word"
            data-index={index}
            className={cn(
              "cursor-pointer rounded-sm transition-colors hover:bg-white/25",
              index === lookedUpIndex && "bg-amber-300 text-amber-950",
            )}
            // The subtitles' host already keeps clicks from the player.
            onClick={() => {
              // A click that ends a text selection belongs to the selection toolbar.
              if (!window.getSelection()?.toString()) {
                lookUp(index)
              }
            }}
          >
            {token.text}
          </span>
        ) : (
          token.text
        ),
      )}
    </span>
  )
}
