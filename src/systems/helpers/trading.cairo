// PR-0b: achievement integration disabled — arcade migrated to component-
// based API. v2 redesigns achievements (see docs/V2_DESIGN.md).
use dojo::event::EventStorage;
// use rollyourown::achievements::achievements_v1::Tasks; // PR-0b: disabled
use rollyourown::{
    config::{drugs::{Drugs}}, events::{TradeDrug}, models::{game::{GameMode}},
    packing::{
        drugs_packed::{DrugsPackedImpl}, game_store::{GameStore, GameStoreTrait},
        items_packed::{ItemsPackedImpl}, markets_packed::{MarketsPackedImpl}, player::{PlayerImpl},
    },
    store::{StoreImpl, StoreTrait}, utils::{math::{MathImplU8}},
};


#[derive(Copy, Drop, Serde, PartialEq)]
pub enum TradeDirection {
    Sell,
    Buy,
}

#[derive(Copy, Drop, Serde)]
pub struct Trade {
    pub direction: TradeDirection,
    pub drug: Drugs,
    pub quantity: u32,
}

//
//
//

const MIN_TICK: usize = 0;
const MAX_TICK: usize = 63;


pub fn execute_trade(
    ref game_store: GameStore, trade: Trade, is_first_sell: bool, is_first_buy: bool,
) {
    // check if can trade
    assert(game_store.can_trade(), 'player cannot trade');

    // check not warrior mode
    assert(game_store.game.game_mode != GameMode::Warrior, 'warriors dont trade');

    match trade.direction {
        TradeDirection::Sell => sell(ref game_store, trade, is_first_sell),
        TradeDirection::Buy => buy(ref game_store, trade, is_first_buy),
    };
}

pub fn buy(ref game_store: GameStore, trade: Trade, is_first_buy: bool) {
    // check drug validity given player drug_level
    assert(game_store.player.can_trade_drug(trade.drug), 'u cant trade this drug');

    // get drugs
    let mut drugs = game_store.drugs.get();

    // must have no drug, or same drug
    assert(drugs.quantity == 0 || drugs.drug == trade.drug, 'one kind of drug');

    // get transport
    let transport = game_store.items.transport();
    let season_settings = game_store.season_settings();
    let drug_config = game_store.store.drug_config(season_settings.drugs_mode, trade.drug);

    // check quantity
    let max_transport = transport - (drugs.quantity * drug_config.weight.into());
    assert(trade.quantity <= max_transport, 'not enought space');

    // check cash
    let (_tick, market_price) = game_store
        .get_tick_and_drug_price(game_store.player.location, trade.drug);
    let total_cost = market_price * trade.quantity;
    assert(game_store.player.cash >= total_cost, 'not enought ca$h');

    // update drug
    drugs.drug = trade.drug;
    drugs.quantity += trade.quantity;
    game_store.drugs.set(drugs);

    // update cash
    game_store.player.cash -= total_cost;

    // emit TradeDrug
    let mut store = game_store.store;
    store
        .world
        .emit_event(
            @TradeDrug {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                turn: game_store.player.turn,
                drug_id: Into::<Drugs, u8>::into(trade.drug).into(),
                quantity: trade.quantity,
                price: market_price,
                is_buy: true,
            },
        );

    // PR-0b: BUY_LOW achievement disabled — see helpers/shopping.cairo header.
    // if game_store.game.is_ranked() && is_first_buy && tick == MIN_TICK {
    //     bushido_store.progress(player_id_felt, Tasks::BUY_LOW, 1, time);
    // }
}


pub fn sell(ref game_store: GameStore, trade: Trade, is_first_sell: bool) {
    // check drug validity given player drug_level
    assert(game_store.player.can_trade_drug(trade.drug), 'u cant trade this drug');

    // get drugs
    let mut drugs = game_store.drugs.get();

    // must carry right drug
    assert(drugs.drug == trade.drug, 'invalid drug');

    // must have enought to sell
    assert(drugs.quantity >= trade.quantity, 'not enought drug');

    let (_tick, market_price) = game_store
        .get_tick_and_drug_price(game_store.player.location, trade.drug);
    let total = market_price * trade.quantity;

    // update drug
    drugs.quantity -= trade.quantity;
    game_store.drugs.set(drugs);

    // update cash
    game_store.player.cash += total;

    // emit TradeDrug
    let mut store = game_store.store;
    store
        .world
        .emit_event(
            @TradeDrug {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                turn: game_store.player.turn,
                drug_id: Into::<Drugs, u8>::into(trade.drug).into(),
                quantity: trade.quantity,
                price: market_price,
                is_buy: false,
            },
        );

    // PR-0b: VOLUME / SELL_HIGH achievements disabled — see header.
    // if game_store.game.is_ranked() && is_first_sell {
    //     bushido_store.progress(player_id_felt, Tasks::VOLUME, total.into(), time);
    //     if tick == MAX_TICK {
    //         bushido_store.progress(player_id_felt, Tasks::SELL_HIGH, 1, time);
    //     }
    // }
}
