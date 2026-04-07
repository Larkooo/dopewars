// PR-0b: achievement integration disabled — arcade migrated from
// `Store::progress` to a component-based API. v2 will redesign achievements
// from scratch (see docs/V2_DESIGN.md). All bushido_store calls in this file
// are commented out for now.
use dojo::event::EventStorage;
use rollyourown::packing::game_store::GameStoreTrait;

use rollyourown::{
    config::{hustlers::{ItemSlot}, locations::{Locations}}, events::{UpgradeItem},
    models::game::{GameImpl},
    packing::{
        game_store::{GameStore, GameStoreImpl}, items_packed::{ItemsPackedImpl},
        player::{PlayerImpl}, wanted_packed::{WantedPackedImpl},
    },
    store::{StoreImpl}, utils::{math::{MathImpl, MathTrait}},
};
use super::super::super::config::gear::GearItemConfigTrait;


#[derive(Copy, Drop, Serde)]
pub struct Action {
    pub slot: ItemSlot,
}

pub fn execute_action(ref game_store: GameStore, action: Action) {
    // get wanted
    let wanted = if game_store.player.location == Locations::Home {
        0
    } else {
        // u8 sub_overflow if location = Home = 0
        game_store.wanted.get(game_store.player.location)
    };

    // closed for wanted < max_wanted_shopping
    assert(wanted < game_store.game_config().max_wanted_shopping, 'too dangerous');

    // get current item
    let current_item = game_store.items.get_item(action.slot);

    // check item max level
    assert(current_item.level != 3, 'max level u chad');

    let level: u8 = current_item.level.into();
    let next_level = level + 1;

    let next_item = current_item.next_level_config();

    // check can buy
    assert(game_store.player.cash >= *next_item.cost, 'too poor');

    // pay item
    game_store.player.cash -= *next_item.cost;

    // gibe item to customer
    game_store.items.upgrade_item(action.slot);

    // earn reputation
    let game_config = game_store.game_config();
    game_store
        .player
        .reputation = game_store
        .player
        .reputation
        .add_capped(game_config.rep_buy_item, 100);

    // // emit event
    game_store
        .store
        .world
        .emit_event(
            @UpgradeItem {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                turn: game_store.player.turn,
                item_slot: action.slot.into(),
                item_level: next_level,
            },
        );

    // PR-0b: STUFFED achievement progression disabled. Re-add via the v2
    // achievement system once it's redesigned.
    // if game_store.game.is_ranked() && game_store.items.is_maxed_out() {
    //     bushido_store.progress(player_id_felt, Tasks::STUFFED, 1, time);
    // }
}

