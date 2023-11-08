import {
  CollectibleType,
  LevelStage,
  RoomType,
  StageType,
} from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  game,
  getRoomDescriptorsForType,
  goToStage,
  log,
  onSetSeed,
} from "isaacscript-common";
import { mod } from "./mod";

const STAGE_TO_LOOK_IN = LevelStage.CAVES_1;
const STAGE_TYPE_TO_LOOK_IN = StageType.REPENTANCE;
const ROOM_TYPE_TO_LOOK_FOR = RoomType.TREASURE;
const ROOM_VARIANT_TO_LOOK_FOR = 2;

export function main(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    postGameStartedReorderedFalse,
    false,
  );
}

// ModCallbackCustom.POST_GAME_STARTED_REORDERED
function postGameStartedReorderedFalse() {
  if (onSetSeed()) {
    return;
  }

  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();
  log(`POST_GAME_STARTED_REORDERED - ${startSeedString}`);

  goToStage(STAGE_TO_LOOK_IN, STAGE_TYPE_TO_LOOK_IN);
  const roomDescriptors = getRoomDescriptorsForType(ROOM_TYPE_TO_LOOK_FOR);

  let found = false;
  for (const roomDescriptor of roomDescriptors) {
    if (
      roomDescriptor.Data !== undefined &&
      roomDescriptor.Data.Variant === ROOM_VARIANT_TO_LOOK_FOR
    ) {
      found = true;
      log(`Found room: ${ROOM_TYPE_TO_LOOK_FOR}.${ROOM_VARIANT_TO_LOOK_FOR}`);
    }
  }

  if (found) {
    const player = Isaac.GetPlayer();
    player.AddCollectible(CollectibleType.MIND);
  } else {
    mod.restartNextRenderFrame();
  }
}
