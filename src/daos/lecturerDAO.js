const connection = require('../configs/database');
const queryConstants = require('../constants/queryConstants');
const moment = require('moment');
const { getCurrentTimeFormat } = require('../helpers/timeHelper');

/****************************************************************
 ***********************LECTURER DAO*****************************
 ****************************************************************/

/**
 *  Query to get all the lecturers, with only usable column in the lecturer base table (without join any table)
 * @return {Promise}
 */
function getAllLecturersWithBasicInformation() {
	return new Promise(function (resolve, reject) {
		const query = [
			`SELECT id, name, gender, avatar, DATE_FORMAT(date_of_birth, "%d-%m-%Y"), ${queryConstants.GET_METADATA_QUERY}`,
			'FROM lecturer_information',
			queryConstants.FILTER_DELETED_RECORD_QUERY,
		].join(' ');

		let lecturers = null;
		connection.query(query, (error, results, fields) => {
			if (error) {
				reject(error);
				return;
			}
			lecturers = results;
			resolve(lecturers);
		});
	});
}

/**
 *  Query to get all the lecturers
 *  with offset and limit size for pagination
 *
 * @param {number} offset
 * @param {number} limitSize
 * @return {Promise}
 */
function getAllLecturersWithPagination(offset, limitSize) {
	return new Promise(function (resolve, reject) {
		const query = [
			`SELECT id, name, gender, avatar, DATE_FORMAT(date_of_birth, "%d-%m-%Y"), ${queryConstants.GET_METADATA_QUERY}`,
			'FROM lecture_information',
			queryConstants.FILTER_DELETED_RECORD_QUERY,
			`ORDER BY id ASC`,
			'LIMIT ?, ?',
		].join(' ');

		let lecturers = null;
		connection.query(query, [offset, limitSize], (error, results, fields) => {
			if (error) {
				console.log('error ', error);
				reject(error);
				return;
			}
			lecturers = results;
			resolve(lecturers);
		});
	});
}

/**
 *  Query to create multiple contacts type at the same time
 *
 * @param {Array<Object>} lecturers
 * @return {Promise}
 */
function createLecturers(lecturers) {
	console.log(
		'🚀 ~ file: lecturerDAO.js:70 ~ createLecturers ~ lecturers:',
		lecturers
	);
	return new Promise(function (resolve, reject) {
		const query = [
			`INSERT INTO lecturer_information(account_id,name,gender,avatar,date_of_birth,academic_rank_id,academic_rank_gain_year,academic_title_id,academic_title_gain_year, created_at, updated_at, is_deleted,expand_column)`,
			'VALUES ?',
		].join(' ');

		const now = moment().utc().format('YYYY/MM/DD hh:mm:ss');
		const is_deleted = false;
		const values = lecturers.map((lecturer) => [
			lecturer.account_id,
			lecturer.name,
			lecturer.gender,
			lecturer.avatar,
			lecturer.date_of_birth,
			lecturer.academic_rank_id,
			lecturer.academic_rank_gain_year,
			lecturer.academic_title_id,
			lecturer.academic_title_gain_year,
			now,
			now,
			is_deleted,
			lecturer.expand_column,
		]);

		//Using bulk insertion for better performance
		connection.query(query, [values], (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			console.log('result ', result);
			const size = result.affectedRows;
			const firstId = result.insertId;
			const finalId = firstId + size;
			let ids = [];
			for (let i = firstId; i < finalId; i++) {
				ids.push(i);
			}
			console.log('ids ', ids);
			resolve(ids);
		});
	});
}
/**
 * Query to get lecturer by its id
 */
function getLecturerById(id) {
	return new Promise(function (resolve, reject) {
		const query = [
			`SELECT id, name`,
			`FROM lecturer_information`,
			`WHERE id = ?`,
			'LIMIT 1',
		].join(' ');

		let lecturer = null;
		connection.query(query, [id], (error, results, fields) => {
			if (error) {
				reject(error);
				return;
			}

			lecturer = results;
			resolve(lecturer);
		});
	});
}
/**
 * Query to update lecturer by its id
 * @param {number} id
 * @param {Object} lecturer
 */
function updateLecturer(id, lecturer) {
	return new Promise(function (resolve, reject) {
		console.log(
			'🚀 ~ file: lecturerDAO.js:149 ~ updateLecturer ~ lecturer:',
			lecturer
		);
		let {
			account_id,
			name,
			gender,
			avatar,
			date_of_birth,
			academic_rank_id,
			academic_rank_gain_year,
			academic_title_id,
			academic_title_gain_year,
			is_deleted,
			expand_column,
		} = lecturer;
		const query = [
			'UPDATE lecturer_information',
			`SET account_id = ?, name= ? ,gender = ? , avatar = ? , date_of_birth = ?, academic_rank_id = ?, academic_rank_gain_year = ?, academic_title_id = ? , academic_title_gain_year = ?,is_deleted = ?, updated_at = ?, expand_column = ?`,
			`WHERE id = ?`,
		].join(' ');

		const now = moment().utc().format('YYYY/MM/DD hh:mm:ss');

		connection.query(
			query,
			[
				account_id,
				name,
				gender,
				avatar,
				date_of_birth,
				academic_rank_id,
				academic_rank_gain_year,
				academic_title_id,
				academic_title_gain_year,
				is_deleted,
				now,
				expand_column,
				id,
			],
			function (error, results, fields) {
				if (error) {
					console.log('error ', error);
					reject(error);
				}
				console.log('result ', results);

				resolve(results);
			}
		);
	});
}

/**
 * @param {Array<String>} ids
 * @return {Promise}
 */
function deleteLecturers(ids) {
	return new Promise(function (resolve, reject) {
		const query = [
			`UPDATE lecturer_information`,
			`SET is_deleted = ?, updated_at = ?`,
			'WHERE id IN (?)',
		].join(' ');

		const now = getCurrentTimeFormat();
		connection.query(query, [true, now, ids], (error, result, fields) => {
			if (error) {
				reject(error);
				return;
			}

			const size = result.affectedRows;
			resolve(size);
		});
	});
}

module.exports = {
	getAllLecturersWithBasicInformation,
	getAllLecturersWithPagination,
	createLecturers,
	updateLecturer,
	deleteLecturers,
};
