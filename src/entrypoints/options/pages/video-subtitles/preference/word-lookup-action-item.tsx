import { useAtomValue, useSetAtom } from "jotai"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base-ui/select"
import { configAtom, configFieldsAtomMap } from "@/utils/atoms/config"
import { getSelectionToolbarActions, resolveWordLookupAction } from "@/utils/custom-actions"
import { i18n } from "@/utils/i18n"
import { ActionIdentity } from "../../../components/action-identity"
import { ConfigItem } from "../../../components/config-item"

export function WordLookupActionItem() {
  const config = useAtomValue(configAtom)
  const setVideoSubtitlesConfig = useSetAtom(configFieldsAtomMap.videoSubtitles)
  const selectedAction = resolveWordLookupAction(config)
  // Every enabled action, plus the one in effect even when it is off.
  const choices = getSelectionToolbarActions(config.selectionToolbar).filter(
    (action) => action.enabled !== false || action.id === selectedAction.id,
  )
  const title = i18n.t("options.videoSubtitles.preference.wordLookupAction.title")

  return (
    <ConfigItem
      id="subtitles-word-lookup-action"
      title={title}
      description={i18n.t("options.videoSubtitles.preference.wordLookupAction.description")}
    >
      <Select
        value={selectedAction.id}
        onValueChange={(wordLookupActionId) => {
          if (wordLookupActionId) {
            void setVideoSubtitlesConfig({ wordLookupActionId })
          }
        }}
      >
        <SelectTrigger size="sm" className="max-w-60" aria-label={title}>
          <SelectValue render={<span className="min-w-0 flex-1" />}>
            <ActionIdentity action={selectedAction} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {choices.map((action) => (
              <SelectItem key={action.id} value={action.id}>
                <ActionIdentity action={action} />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </ConfigItem>
  )
}
