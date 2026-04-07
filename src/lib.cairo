pub mod constants;

pub mod events;

pub mod store;

#[cfg(test)]
pub mod tests;

// PR-0b: achievement integration disabled until v2 redesign — see
// docs/V2_DESIGN.md. The arcade dojo_1.7.1 → main upgrade migrated the
// `Store::progress` API to a component-based one, and the v2 plan removes
// most of the existing tasks anyway (the L1-keyed ones).
// pub mod achievements {
//     pub mod achievements_v1;
// }

pub mod traits;
pub mod config {
    pub mod config;
    pub mod drugs;
    pub mod encounters;
    pub mod game;
    pub mod gear;
    pub mod hustlers;
    pub mod locations;
    pub mod ryo;
    pub mod ryo_address;
    pub mod settings;
}

pub mod helpers {
    pub mod rewarder;
    pub mod season_manager;
}

pub mod models {
    pub mod game;
    pub mod game_store_packed;
    pub mod gear_template;
    pub mod hustler_instance;
    pub mod hustler_template;
    pub mod payment_config;

    pub mod season;
    pub mod starterpack;
}

pub mod packing {
    pub mod drugs_packed;
    pub mod game_store;
    pub mod game_store_layout;
    pub mod items_packed;
    pub mod markets_packed;

    pub mod player;
    pub mod player_layout;
    pub mod wanted_packed;
}

pub mod systems {
    pub mod decide;
    pub mod game;
    pub mod ryo;

    pub mod helpers {
        pub mod game_loop;
        pub mod shopping;

        pub mod trading;
        pub mod traveling;
    }
    pub mod devtools;
}

pub mod tokens {
    // pub mod chips;
    pub mod hustler;
    pub mod paper;
}

pub mod utils {
    pub mod bits;
    pub mod bytes16;
    pub mod introspect;
    pub mod math;
    pub mod payout_structure;
    pub mod random;
    pub mod sorted_list;
}

pub mod interfaces {
    pub mod chips;
    pub mod erc721;
    pub mod paper;
    pub mod vrf;
}

pub mod _mocks {
    pub mod paper_mock;
    pub mod vrf_provider_mock;
}

// Transitional stubs replacing the dropped `dope_types` external crate.
// PR-1 deletes this entire module — see docs/V2_DESIGN.md.
pub mod _stubs {
    pub mod dope_stubs;
}


pub mod libraries {
    pub mod dopewars_items;
}
