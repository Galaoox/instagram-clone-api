import pool from '../config/database';

/**
 * Encargado de realizar consultas a la base de datos
 * @param sql consulta sql usada en la consulta
 * @param params parametros que seran usados en la consulta
 */
export async function consult(sql: string, params: any) {
    return await pool.query(sql, params);
}

/**
 * Encargado de generar la consulta sql para validar si un valor esta siendo utilizado
 * @param table nombre de la tabla objetivo
 * @param nameColumn nombre de la columna a comparar
 * @param conditionExtra indica si es necesario utilizar la condicion extra si se necesita indicar el id
 */
export function checkColumnValueIsUsedQuery(table: string, nameColumn: string, conditionExtra: Boolean) {
    const condition = 'AND id != ?'
    return `SELECT COUNT(*) as count FROM ${table} WHERE ${nameColumn} =  ? ${conditionExtra ? condition : ''}`;
}
/**
 * Abstraccion generica para realizar insert en una tabla
 * @param table nombre de la tabla objetivo
 * @param params parametros que se usaran para realizar el insert
 */
export function generalInsert(table: string, params: JSON | Object) {
    try {
        return consult(`INSERT INTO ${table} SET ?`, params);
    } catch (error) {
        console.log("generalInsert", error);

    }
}

/**
 * Realiza consulta generica donde busca especificamente cierto registro o registros 
 * @param table nombre de la tabla objetivo
 * @param params parametros usados para realizar la consulta
 */
export async function findBy(table: string, params: Object | JSON) {
    try {
        const sql = await `SELECT * FROM ${table} WHERE ${generateConditionsQuery(params)}`;
        const results: any = await consult(sql, Object.values(params));
        return (<Array<any>>results)?.length ? ((<Array<any>>results).length > 1 ? results : results[0]) : null;
    } catch (error) {
        console.log("findBy", error);
    }
}

/**
 * Realiza una consulta generica donde genera de forma dinamica los parametros que se actualizaran
 * y tambien que parametros se usaran para las condiciones
 * @param table nombre de la tabla objetivo
 * @param paramsSetters parametros que indicaran que se actualizara
 * @param paramsConditions parametros que indicaran que condiciones se realizaran
 */
export async function generalUpdate(table: string, paramsSetters: Object | JSON, paramsConditions: Object | JSON) {
    try {
        const sql = `UPDATE ${table} SET ${generateSettersQuery(paramsSetters)} WHERE ${generateConditionsQuery(paramsConditions)} `;
        const results: any = await consult(sql, [...Object.values(paramsSetters), ...Object.values(paramsConditions)]);
        return (<Array<any>>results)?.length ? ((<Array<any>>results).length > 1 ? results : results[0]) : null;
    } catch (error) {
        console.log("updateGeneral", error);
    }
}
/**
 * Realiza un recorrido del JSON y concatena las key para generar un fragmento donde
 * se realizan condiciones
 * @param columns nombres de las columnas 
 */
function generateConditionsQuery(columns: Object | JSON) {
    return Object.keys(columns).reduce((previusColumn, currentColumn, index) => {
        return index === 0 ? (previusColumn + ` ${currentColumn} = ? `) : (previusColumn + ` AND ${currentColumn} = ? `);
    }, '');
}

/**
 * Realiza un recorrido del JSON y concatena las key para generar un fragmento donde
 * se realiza la insercion de informacion en esas columnas
 * @param columns nombres de las columnas 
 */
function generateSettersQuery(columns: Object | JSON) {
    return Object.keys(columns).reduce((previusColumn, currentColumn, index) => {
        return previusColumn + ` ${currentColumn} = ? `;
    }, '');
}