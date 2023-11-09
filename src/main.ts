import {
  CollectibleType,
  LevelStage,
  RoomType,
  StageType,
} from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  ReadonlySet,
  game,
  getRoomDescriptorsForType,
  goToStage,
  log,
  onSetSeed,
} from "isaacscript-common";
import { mod } from "./mod";

const STAGE_TO_LOOK_IN = LevelStage.WOMB_1;
const STAGE_TYPE_TO_LOOK_IN = StageType.ORIGINAL;
const ROOM_TYPE_TO_LOOK_FOR = RoomType.BOSS;
const ROOM_VARIANTS_TO_LOOK_FOR = new ReadonlySet([4031, 4032, 4033]);

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
      ROOM_VARIANTS_TO_LOOK_FOR.has(roomDescriptor.Data.Variant)
    ) {
      found = true;
      log(
        `Found room: ${roomDescriptor.Data.Type}.${roomDescriptor.Data.Variant}`,
      );
    }
  }

  if (found) {
    const player = Isaac.GetPlayer();
    player.AddCollectible(CollectibleType.MIND);
  } else {
    mod.restartNextRenderFrame();
  }
}
