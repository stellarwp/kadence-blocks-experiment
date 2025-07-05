import { SafeParseJSON } from '@kadence/kbsHelpers';
/**
 * Check if the user has correct user data
 *
 * @param {Object} tempData - User data from the temp data
 * @return {boolean} True if the user has correct user data, false otherwise
 */
export const hasCorrectUserData = (tempData) => {
	const parsedUserData = SafeParseJSON(tempData, true);
	if (!parsedUserData) {
		return false;
	}
	// Check for CompanyName, Location, Industry, MissionStatement, Keywords.
	if (!parsedUserData?.companyName || '' === parsedUserData?.companyName) {
		return false;
	}
	if (!parsedUserData?.location || '' === parsedUserData?.location) {
		return false;
	}
	if (!parsedUserData?.industry || '' === parsedUserData?.industry) {
		return false;
	}
	if (!parsedUserData?.missionStatement || '' === parsedUserData?.missionStatement) {
		return false;
	}
	if (!parsedUserData?.keywords?.length || parsedUserData?.keywords?.length < 5) {
		return false;
	}
	if (!parsedUserData?.tone || '' === parsedUserData?.tone) {
		return false;
	}
	return true;
};
