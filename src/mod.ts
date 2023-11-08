import { ISCFeature, upgradeMod } from "isaacscript-common";

const MOD_NAME = "isaac-room-finder";

const FEATURES = [ISCFeature.RUN_IN_N_FRAMES] as const;

const modVanilla = RegisterMod(MOD_NAME, 1);
export const mod = upgradeMod(modVanilla, FEATURES);
