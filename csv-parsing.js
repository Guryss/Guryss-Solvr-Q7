"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var date_fns_1 = require("date-fns");
var csv_writer_1 = require("csv-writer");
// 레포지토리 데이터 비동기 fetch 함수
function fetchReleases(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://api.github.com/repos/".concat(owner, "/").concat(repo, "/releases");
                    return [4 /*yield*/, (0, node_fetch_1.default)(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch releases for ".concat(owner, "/").concat(repo));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function generateStats(releases) {
    var statsMap = new Map();
    releases.forEach(function (release) {
        var date = (0, date_fns_1.parseISO)(release.published_at);
        var year = (0, date_fns_1.getYear)(date);
        var week = (0, date_fns_1.getISOWeek)(date);
        var day = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
        var key = "".concat(year, "-W").concat(week, "-").concat(day);
        if (statsMap.has(key)) {
            statsMap.get(key).count += 1;
        }
        else {
            statsMap.set(key, { year: year, week: week, date: day, count: 1 });
        }
    });
    return Array.from(statsMap.values());
}
// CSV 파일 생성 함수
function saveStatsToCSV(stats, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var csvWriter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                        path: filename,
                        header: [
                            { id: 'year', title: 'Year' },
                            { id: 'week', title: 'Week' },
                            { id: 'date', title: 'Date' },
                            { id: 'count', title: 'Release Count' },
                        ],
                    });
                    return [4 /*yield*/, csvWriter.writeRecords(stats)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var repos, _i, repos_1, _a, owner, repo, releases, stats, filename, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    repos = [
                        { owner: 'daangn', repo: 'stackflow' },
                        { owner: 'daangn', repo: 'seed-design' },
                    ];
                    _i = 0, repos_1 = repos;
                    _b.label = 1;
                case 1:
                    if (!(_i < repos_1.length)) return [3 /*break*/, 7];
                    _a = repos_1[_i], owner = _a.owner, repo = _a.repo;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetchReleases(owner, repo)];
                case 3:
                    releases = _b.sent();
                    stats = generateStats(releases);
                    filename = "".concat(repo, "_release_stats.csv");
                    return [4 /*yield*/, saveStatsToCSV(stats, filename)];
                case 4:
                    _b.sent();
                    console.log("Saved stats for ".concat(owner, "/").concat(repo, " to ").concat(filename));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error("Error processing ".concat(owner, "/").concat(repo, ":"), error_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
main();
