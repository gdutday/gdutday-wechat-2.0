const swapKeysAndValues = (dict) =>
    Object.entries(dict).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {});

const newToOldDict = {
    "coursePlace": "ad",
    "courseName": "cn",
    "courseTeacher": "tn",
    "courseDay": "wd",
    "courseWeek": "w",
    "courseDescription": "cc",
    "courseSection": "cs"
};

const oldToNewDict = swapKeysAndValues(newToOldDict);

const convertSingleCourseToOld = (newCourse) =>
    Object.fromEntries(
        Object.entries(newCourse)
            .filter(kv => newToOldDict.hasOwnProperty(kv[0]))
            .map(kv => [newToOldDict[kv[0]], kv[1]])
    );

const convertCourseArrayToOld = (newCourseArray) =>
    Array.from(newCourseArray).map(convertSingleCourseToOld);

const convertToOldCourseData = (newData) =>
    Object.fromEntries(
        Object.entries(newData)
            .map(kv => [kv[0], convertCourseArrayToOld(kv[1])])
    );

const convertSingleCourseToNew = (oldCourse) =>
    Object.fromEntries(
        Object.entries(oldCourse)
            .filter(kv => oldToNewDict.hasOwnProperty(kv[0]))
            .map(kv => [oldToNewDict[kv[0]], kv[1]])
    );

const convertCourseArrayToNew = (oldCourseArray) =>
    Array.from(oldCourseArray).map(convertSingleCourseToNew);

const convertToNewCourseData = (oldData) =>
    Object.fromEntries(
        Object.entries(oldData)
            .map(kv => [kv[0], convertCourseArrayToNew(kv[1])])
    );

const newData = {
    "msg": "操作成功",
    "code": 200,
    "data": {
        "11": [
            {
                "courseName": "大学美育(1)",
                "coursePlace": "教2-429",
                "courseTeacher": "齐顺利",
                "courseWeek": "11",
                "courseDay": "1",
                "courseSection": "10,11,12",
                "courseDescription": "中国电影简史（一）"
            },
            {
                "courseName": "大学物理实验(2)",
                "coursePlace": "实4-409",
                "courseTeacher": "陈峻",
                "courseWeek": "11",
                "courseDay": "5",
                "courseSection": "5,6,7",
                "courseDescription": "实验五、用模拟法测绘静电场"
            },
            {
                "courseName": "数字电子技术实验",
                "coursePlace": "实3-408",
                "courseTeacher": "彭端",
                "courseWeek": "11",
                "courseDay": "4",
                "courseSection": "1,2",
                "courseDescription": "8 路彩灯循环控制电路"
            },
            {
                "courseName": "模拟电子技术实验",
                "coursePlace": "实3-417",
                "courseTeacher": "陈灵敏",
                "courseWeek": "11",
                "courseDay": "1",
                "courseSection": "3,4,5",
                "courseDescription": "差动直流放大器"
            },
            {
                "courseName": "体育(3)",
                "coursePlace": "",
                "courseTeacher": "曾俊玮",
                "courseWeek": "11",
                "courseDay": "3",
                "courseSection": "6,7",
                "courseDescription": "十一、1.复习正手发高远球技术和后场击高远球技术；2.学习搓球技术；3身体素质练习；4.教学比赛。（线下）\n          1.复习正手发高远球技术和后场击高远球技术；2.学习搓球技术；3.复习体育基本理论、专项基本理论。（线上）"
            },
            {
                "courseName": "信号与系统",
                "coursePlace": "教2-315",
                "courseTeacher": "张伟娜",
                "courseWeek": "11",
                "courseDay": "5",
                "courseSection": "3,4",
                "courseDescription": "第四章第5节。付立叶变换的性质。"
            },
            {
                "courseName": "数字电子技术",
                "coursePlace": "教2-523",
                "courseTeacher": "崔苗",
                "courseWeek": "11",
                "courseDay": "2",
                "courseSection": "3,4",
                "courseDescription": "6.2 时序逻辑电路的分析方法"
            },
            {
                "courseName": "模拟电子技术",
                "coursePlace": "教3-307",
                "courseTeacher": "潘晴",
                "courseWeek": "11",
                "courseDay": "3",
                "courseSection": "1,2",
                "courseDescription": "7.2负反馈放大电路的方框图及一般表达式；7.3.1深度负反馈的实质 7.3.2深度负反馈条件下电压放大倍数的分析"
            },
            {
                "courseName": "大学物理(2)",
                "coursePlace": "教1-419",
                "courseTeacher": "王银海",
                "courseWeek": "11",
                "courseDay": "1",
                "courseSection": "1,2",
                "courseDescription": "15.3洛伦兹变换"
            },
            {
                "courseName": "大学物理(2)",
                "coursePlace": "教1-419",
                "courseTeacher": "王银海",
                "courseWeek": "11",
                "courseDay": "3",
                "courseSection": "3,4",
                "courseDescription": "15.4狭义相对论动力学基础"
            }
        ],
        "12": [
            {
                "courseName": "大学美育(1)",
                "coursePlace": "教2-429",
                "courseTeacher": "齐顺利",
                "courseWeek": "12",
                "courseDay": "1",
                "courseSection": "10,11,12",
                "courseDescription": "中国电影简史（二）"
            },
            {
                "courseName": "大学物理实验(2)",
                "coursePlace": "实4-511",
                "courseTeacher": "陈峻",
                "courseWeek": "12",
                "courseDay": "5",
                "courseSection": "5,6,7",
                "courseDescription": "实验九、旋光性溶液浓度的测量"
            },
            {
                "courseName": "数字电子技术实验",
                "coursePlace": "实3-408",
                "courseTeacher": "彭端",
                "courseWeek": "12",
                "courseDay": "4",
                "courseSection": "1,2",
                "courseDescription": "七段LED数码管数字显示"
            },
            {
                "courseName": "体育(3)",
                "coursePlace": "",
                "courseTeacher": "曾俊玮",
                "courseWeek": "12",
                "courseDay": "3",
                "courseSection": "6,7",
                "courseDescription": "十二、1.专项技术复习与答疑；考核内容、要求与评分标准（正手发高远球）。2.复习体育基本理论、专项基本理论。（线上、线下）"
            },
            {
                "courseName": "信号与系统",
                "coursePlace": "教2-315",
                "courseTeacher": "张伟娜",
                "courseWeek": "12",
                "courseDay": "5",
                "courseSection": "3,4",
                "courseDescription": "分组讨论：信号的频谱分析"
            },
            {
                "courseName": "数字电子技术",
                "coursePlace": "教2-523",
                "courseTeacher": "崔苗",
                "courseWeek": "12",
                "courseDay": "2",
                "courseSection": "3,4",
                "courseDescription": "6.3 常用的时序逻辑电路"
            },
            {
                "courseName": "模拟电子技术",
                "coursePlace": "教3-307",
                "courseTeacher": "潘晴",
                "courseWeek": "12",
                "courseDay": "3",
                "courseSection": "1,2",
                "courseDescription": "7.3.3理想运放组成的负反馈放大电路的分析 7.4负反馈对放大电路性能的影响"
            },
            {
                "courseName": "大学物理(2)",
                "coursePlace": "教1-419",
                "courseTeacher": "王银海",
                "courseWeek": "12",
                "courseDay": "1",
                "courseSection": "1,2",
                "courseDescription": "第16章 量子物理基础 16.1 黑体辐射  16.2光电效应"
            },
            {
                "courseName": "大学物理(2)",
                "coursePlace": "教1-419",
                "courseTeacher": "王银海",
                "courseWeek": "12",
                "courseDay": "3",
                "courseSection": "3,4",
                "courseDescription": "16.3 康普顿散射  16.4 玻尔氢原子理论"
            }
        ]
    }
};

const oldData = {
    "code": 4000,
    "data": {
        "10": [
            {
                "ad": "教2-425",
                "cn": "工程硕士英语",
                "tn": "杨燕荣",
                "wd": 1,
                "w": "10",
                "cc": "工程硕士英语5",
                "cs": "6,7",
                "key": "工程硕士英语1-12周1",
                "xs": 12,
                "id": 6
            },
            {
                "ad": "教2-425",
                "cn": "工程硕士英语",
                "tn": "杨燕荣",
                "wd": 2,
                "w": "10",
                "cc": "工程硕士英语5",
                "cs": "1,2",
                "key": "工程硕士英语1-12周2",
                "xs": 12,
                "id": 9
            },
            {
                "ad": "教2-425",
                "cn": "新时代中国特色社会主义理论与实践",
                "tn": "冯英",
                "wd": 2,
                "w": "10",
                "cc": "新时代14",
                "cs": "7,8",
                "key": "新时代中国特色社会主义理论与实践1-16周2",
                "xs": 16,
                "id": 5
            },
            {
                "ad": "教2-425",
                "cn": "新一代信息安全技术",
                "tn": "柳毅",
                "wd": 4,
                "w": "10",
                "cc": "新一代信息安全技术02",
                "cs": "10,11,12",
                "key": "新一代信息安全技术1-11周4",
                "xs": 11,
                "id": 4
            },
            {
                "ad": "教2-522",
                "cn": "云计算与大数据技术",
                "tn": "姜文超",
                "wd": 5,
                "w": "10",
                "cc": "云计算与大数据技术02",
                "cs": "10,11,12",
                "key": "云计算与大数据技术1-11周5",
                "xs": 11,
                "id": 1
            },
            {
                "ad": "教2-522",
                "cn": "深度学习",
                "tn": "陈云华",
                "wd": 5,
                "w": "10",
                "cc": "深度学习03",
                "cs": "5,6,7",
                "key": "深度学习1-11周5",
                "xs": 11,
                "id": 3
            }
        ],
        "11": [
            {
                "ad": "教2-425",
                "cn": "工程硕士英语",
                "tn": "杨燕荣",
                "wd": 1,
                "w": "11",
                "cc": "工程硕士英语5",
                "cs": "6,7",
                "key": "工程硕士英语1-12周1",
                "xs": 12,
                "id": 6
            },
            {
                "ad": "教2-425",
                "cn": "工程硕士英语",
                "tn": "杨燕荣",
                "wd": 2,
                "w": "11",
                "cc": "工程硕士英语5",
                "cs": "1,2",
                "key": "工程硕士英语1-12周2",
                "xs": 12,
                "id": 9
            },
            {
                "ad": "教2-425",
                "cn": "新时代中国特色社会主义理论与实践",
                "tn": "冯英",
                "wd": 2,
                "w": "11",
                "cc": "新时代14",
                "cs": "7,8",
                "key": "新时代中国特色社会主义理论与实践1-16周2",
                "xs": 16,
                "id": 5
            },
            {
                "ad": "教2-425",
                "cn": "新一代信息安全技术",
                "tn": "柳毅",
                "wd": 4,
                "w": "11",
                "cc": "新一代信息安全技术02",
                "cs": "10,11",
                "key": "新一代信息安全技术1-11周4",
                "xs": 11,
                "id": 4
            },
            {
                "ad": "教2-522",
                "cn": "云计算与大数据技术",
                "tn": "姜文超",
                "wd": 5,
                "w": "11",
                "cc": "云计算与大数据技术02",
                "cs": "10,11",
                "key": "云计算与大数据技术1-11周5",
                "xs": 11,
                "id": 1
            },
            {
                "ad": "教2-522",
                "cn": "深度学习",
                "tn": "陈云华",
                "wd": 5,
                "w": "11",
                "cc": "深度学习03",
                "cs": "5,6",
                "key": "深度学习1-11周5",
                "xs": 11,
                "id": 3
            }
        ],
        "12": [
            {
                "ad": "教2-425",
                "cn": "工程硕士英语",
                "tn": "杨燕荣",
                "wd": 1,
                "w": "12",
                "cc": "工程硕士英语5",
                "cs": "6,7",
                "key": "工程硕士英语1-12周1",
                "xs": 12,
                "id": 6
            },
            {
                "ad": "教2-425",
                "cn": "工程硕士英语",
                "tn": "杨燕荣",
                "wd": 2,
                "w": "12",
                "cc": "工程硕士英语5",
                "cs": "1,2",
                "key": "工程硕士英语1-12周2",
                "xs": 12,
                "id": 9
            },
            {
                "ad": "教2-425",
                "cn": "新时代中国特色社会主义理论与实践",
                "tn": "冯英",
                "wd": 2,
                "w": "12",
                "cc": "新时代14",
                "cs": "7,8",
                "key": "新时代中国特色社会主义理论与实践1-16周2",
                "xs": 16,
                "id": 5
            }
        ],
    },
    "isLive": true,
    "msg": "课表获取成功！"
}

export const scheduleStudentV2Adaptor = (rawData) => {
    console.log('rawData', rawData);
    const resultData = convertToOldCourseData(rawData)
    console.log('resultData', resultData);
    return resultData
}

// let oldDataConvertFromNew = {...newData};
// oldDataConvertFromNew.data = convertToOldCourseData(newData.data);

// let newDataConvertFromOld = {...oldData};
// newDataConvertFromOld.data = convertToNewCourseData(oldData.data);