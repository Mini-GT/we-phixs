import { useSound } from "react-sounds";

export function useAppSounds() {
  const { play: playBtnSoft } = useSound("/sounds/button_soft_double.mp3", { rate: 1.6 });
  const { play: playPnlCollapse } = useSound("/sounds/panel_collapse.mp3");
  const { play: playPnlExpand } = useSound("/sounds/panel_expand.mp3");
  const { play: playSuccess } = useSound("/sounds/success.mp3");

  return {
    playBtnSoft,
    playPnlCollapse,
    playPnlExpand,
    playSuccess,
  };
}
