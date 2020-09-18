import pool from '../config/database';

export async function consult(sql: string, params: any) {
    return await pool.query(sql, params);
}

export function checkColumnValueIsUsedQuery(table: string, nameColumn: string, conditionExtra: Boolean) {
    const condition = 'AND id != ?'
    return `SELECT COUNT(*) as count FROM ${table} WHERE ${nameColumn} =  ? ${conditionExtra ? condition : ''}`;
}

export function generalInsert(table: string, params: JSON | Object) {
    try {
        return consult(`INSERT INTO ${table} SET ?`, params);
    } catch (error) {
        console.log("generalInsert", error);

    }
}

export async function findBy(table: string, params: Object | JSON) {
    try {
        const sql = await `SELECT * FROM ${table} WHERE ${generateaditionalConditions(params)}`;
        const results: any = await consult(sql, Object.values(params));
        return (<Array<any>>results)?.length ? ((<Array<any>>results).length > 1 ? results : results[0]) : null;
    } catch (error) {
        console.log("findBy", error);
    }
}

function generateaditionalConditions(columns: Object | JSON) {
    return Object.keys(columns).reduce((previusColumn, currentColumn, index) => {
        return index === 0 ? (previusColumn + ` ${currentColumn} = ? `) : (previusColumn + ` AND ${currentColumn} = ? `);
    }, '');
}