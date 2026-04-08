// v2 test layout:
//
// - v2_helper       — shared spawn fixture for tests that need a real
//                     dojo world (paper + hustler + purchase + content).
// - v2_unit_*       — pure unit tests for v2 models / pricing math /
//                     rewarder math. No world required. Lifted out of
//                     the production files in PR-2b so all tests live
//                     under one tree.
// - v2_paper        — integration tests for the PAPER ERC20: role
//                     enforcement, mint/burn supply movement, admin
//                     grant/revoke flow.
// - v2_hustler      — integration tests for the Hustler ERC721: role
//                     enforcement, sequential ids, soulbound transfer
//                     blocking, burn clears soulbound.
// - v2_purchase     — integration tests for the purchase contract:
//                     dojo_init seeding, buy() happy path, disabled
//                     pack rejection.
// - v2_content      — integration tests for the content seeding
//                     contract: dojo_init writes the 16 catalog rows,
//                     dispatcher getters round-trip, admin register
//                     entrypoints rewrite + reject non-owner callers.
//
// The pre-PR-2 modules (test_helper / random / math) referenced an old
// dojo 1.7.x API and were never re-enabled — kept commented for
// archaeology only.
// mod test_helper;
// mod random;
// mod math;

pub mod v2_helper;

mod v2_content;
mod v2_hustler;
mod v2_paper;
mod v2_purchase;

mod v2_unit_gear_template;
mod v2_unit_hustler_instance;
mod v2_unit_hustler_template;
mod v2_unit_payment_config;
mod v2_unit_purchase;
mod v2_unit_rewarder;
mod v2_unit_starterpack;
