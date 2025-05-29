use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};

declare_id!("ReplaceWithYourProgramID");

#[program]
pub mod primetime_access {
    use super::*;

    pub fn buy_access(ctx: Context<BuyAccess>, tier: u8) -> Result<()> {
        let amount = match tier {
            0 => 20 * 10u64.pow(6),  // Monthly
            1 => 200 * 10u64.pow(6), // Yearly
            2 => 150 * 10u64.pow(6), // Lifetime
            _ => return Err(ErrorCode::InvalidTier.into()),
        };

        // Transfer USDT from user to program
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_usdt.to_account_info(),
            to: ctx.accounts.vault_usdt.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        let user_access = &mut ctx.accounts.user_access;
        user_access.user = ctx.accounts.user.key();
        user_access.tier = tier;
        user_access.valid_until = match tier {
            0 => Clock::get()?.unix_timestamp + 30 * 24 * 60 * 60,   // Monthly
            1 => Clock::get()?.unix_timestamp + 365 * 24 * 60 * 60,  // Yearly
            2 => i64::MAX,                                           // Lifetime
            _ => 0,
        };

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(tier: u8)]
pub struct BuyAccess<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: We're not reading from this, just transferring
    #[account(mut)]
    pub user_usdt: Account<'info, TokenAccount>,

    #[account(mut)]
    pub vault_usdt: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + std::mem::size_of::<UserAccess>() as u64,
        seeds = [b"user_access", user.key().as_ref()],
        bump
    )]
    pub user_access: Account<'info, UserAccess>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct UserAccess {
    pub user: Pubkey,
    pub tier: u8,
    pub valid_until: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid tier selected")]
    InvalidTier,
}
