// Closure to hold the APIs if and when available
import tokens from './tokens';

let PROVIDED_IMPL;
export default function configProviderService(serviceAPI) {
    if (!serviceAPI) {
        // reset
        PROVIDED_IMPL = undefined;
    }
    PROVIDED_IMPL = {
        getCoreInfo: serviceAPI.getCoreInfo,
        getPathPrefix: serviceAPI.getPathPrefix,
        getFormFactor: serviceAPI.getFormFactor,
        getToken: serviceAPI.getToken,
        getLocale: serviceAPI.getLocale,
        getLocalizationService: serviceAPI.getLocalizationService,
        sanitizeDOM: serviceAPI.sanitizeDOM,
    };
    return { name: 'lightning-config-provider' };
}
export function getPathPrefix() {
    return (PROVIDED_IMPL && PROVIDED_IMPL.getPathPrefix()) || '';
}
export function getToken(name) {
    return tokens[name];
}
export function getLocale() {
    return {
        userLocaleLang: 'en',
        userLocaleCountry: 'US',
        language: 'en',
        country: 'US',
        variant: '',
        langLocale: 'en_US',
        nameOfMonths: [
            {
                fullName: 'January',
                shortName: 'Jan',
            },
            {
                fullName: 'February',
                shortName: 'Feb',
            },
            {
                fullName: 'March',
                shortName: 'Mar',
            },
            {
                fullName: 'April',
                shortName: 'Apr',
            },
            {
                fullName: 'May',
                shortName: 'May',
            },
            {
                fullName: 'June',
                shortName: 'Jun',
            },
            {
                fullName: 'July',
                shortName: 'Jul',
            },
            {
                fullName: 'August',
                shortName: 'Aug',
            },
            {
                fullName: 'September',
                shortName: 'Sep',
            },
            {
                fullName: 'October',
                shortName: 'Oct',
            },
            {
                fullName: 'November',
                shortName: 'Nov',
            },
            {
                fullName: 'December',
                shortName: 'Dec',
            },
            {
                fullName: '',
                shortName: '',
            },
        ],
        nameOfWeekdays: [
            {
                fullName: 'Sunday',
                shortName: 'SUN',
            },
            {
                fullName: 'Monday',
                shortName: 'MON',
            },
            {
                fullName: 'Tuesday',
                shortName: 'TUE',
            },
            {
                fullName: 'Wednesday',
                shortName: 'WED',
            },
            {
                fullName: 'Thursday',
                shortName: 'THU',
            },
            {
                fullName: 'Friday',
                shortName: 'FRI',
            },
            {
                fullName: 'Saturday',
                shortName: 'SAT',
            },
        ],
        labelForToday: 'Today',
        firstDayOfWeek: 1,
        timezone: 'America/Los_Angeles',
        isEasternNameStyle: false,
        dateFormat: 'MMM d, yyyy',
        datetimeFormat: 'MMM d, yyyy, h:mm:ss a',
        timeFormat: 'h:mm:ss a',
        numberFormat: '#,##0.###',
        decimal: '.',
        grouping: ',',
        zero: '0',
        percentFormat: '#,##0%',
        currencyFormat: '¤ #,##0.00;¤-#,##0.00',
        currencyCode: 'CHF',
        currency: 'SFr.',
        dir: 'ltr',
    };
}
export function getFormFactor() {
    if (typeof jest !== 'undefined') {
        // jest should be default testing the native mobile input , unless window.testDesktop
        // When in a raptor standalone app, we should default to desktop
        return window.testDesktop === true ? 'DESKTOP' : 'MOBILE';
    }
    return 'DESKTOP';
}
export function getLocalizationService() {
    const pad = n => {
        return n < 10 ? '0' + n : n;
    };
    const doublePad = n => {
        return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
    };
    return {
        parseDateTime(dateString) {
            if (!dateString) {
                return null;
            }
            return new Date(dateString);
        },
        parseDateTimeUTC(dateString) {
            if (!dateString) {
                return null;
            }
            return new Date(dateString);
        },
        parseDateTimeISO8601(dateString) {
            // If input is time only
            if (!dateString.includes('-')) {
                dateString = '2014-03-20T' + dateString;
            }
            return new Date(dateString);
        },
        formatDate(date) {
            return date.toISOString().split('T')[0];
        },
        formatDateUTC(date) {
            return this.formatDate(date);
        },
        formatTime(date) {
            return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
                date.getSeconds()
            )}.${doublePad(date.getMilliseconds())}`;
        },
        isBefore(date1, date2) {
            return date1.getTime() < date2.getTime();
        },
        isAfter(date1, date2) {
            return date1.getTime() > date2.getTime();
        },
        isSame(date1, date2) {
            return date1.getTime() === date2.getTime();
        },
        getToday(timezone, callback) {
            return callback(new Date().toISOString().split('T')[0]);
        },
        UTCToWallTime(date, timezone, callback) {
            callback(date);
        },
        WallTimeToUTC(date, timezone, callback) {
            callback(date);
        },
        translateToOtherCalendar(date) {
            return date;
        },
        formatDateTimeUTC(date) {
            return date;
        },
    };
}
export function getCoreInfo() {
    return (
        (PROVIDED_IMPL && PROVIDED_IMPL.getCoreInfo) || {
            untrustedContentDomain: '.fake.localhost.soma.forceusercontent.com',
            localhostPort: 1234,
            securePort: 5678,
        }
    );
}
export function sanitizeDOM(dom) {
    return PROVIDED_IMPL ? PROVIDED_IMPL.sanitizeDOM(dom) : dom;
}