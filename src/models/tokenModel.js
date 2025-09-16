import pool from "../config/db.js";

export const blacklistToken = async (token, exp) => {
    await pool.query(`
            INSERT INTO blacklisted_tokens (token, expires_at)
            VALUES ($1, to_timestamp($2))
        `,
        [token, exp]
    );
};

export const isTokenBlacklisted = async (token) => {
    const result = await pool.query(`
            SELECT 1 FROM blacklisted_tokens WHERE token = $1 AND expires_at > NOW()
        `,
        [token]
    );
    return result.rowCount > 0;
};

export const deleteExpiredBlacklistedTokens = async () => {
    await pool.query(`
            DELETE FROM blacklisted_tokens WHERE expires_at < NOW()
        `);
};

export const saveRefreshToken = async (userId, token, exp) => {
    await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);

    await pool.query(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, to_timestamp($3))",
        [userId, token, exp]
    );
};

export const validateRefreshToken = async (userId, token) => {
    const result = await pool.query(
        "SELECT 1 FROM refresh_tokens WHERE user_id = $1 AND token = $2 AND expires_at > NOW()",
        [userId, token]
    );
    return result.rowCount > 0;
};

export const deleteRefreshToken = async (token) => {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
};

export const findRefreshToken = async (token) => {
    const result = await pool.query(
        "SELECT * FROM refresh_tokens expires_at > NOW()",
        [token]
    );
    for (let row of result.rows) {
        const isMatch = await bcrypt.compare(token, row.token);
        if (isMatch) return row;
    }
};

export const deleteExpiredTokens = async () => {
    const result = await pool.query("SELECT * FROM refresh_tokens");
    for (let row of result.rows) {
        const isMatch = await bcrypt.compare(token, row.token);
        if (isMatch) {
            await pool.query("DELETE FROM refresh_tokens WHERE expires_at < NOW()");
            break;
        }
    }

    console.log("Expired refresh tokens cleaned up");
};