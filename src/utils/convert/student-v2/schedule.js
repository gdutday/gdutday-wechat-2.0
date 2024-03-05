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
    "courseSection": "cs",
    "id": "id"
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


const generateCourseIdDict = (courseData) =>
    Object.fromEntries(
        Object.entries(courseData)
            .flatMap(kv => kv[1])
            .map(cd => cd.courseName || cd.cn)
            .filter(k => k)
            .reduce((acc, obj) => {
                if (!acc.find(i => i === obj)) {
                    acc.push(obj);
                }
                return acc;
            }, [])
            .sort((a, b) => a.localeCompare(b))
            .map((k, i) => [k, i])
    );

const addIdInCourseArray = (courseArray, courseIdDict) =>
    Array.from(courseArray)
        .map(c =>
        ({
            ...c,
            id: courseIdDict[c.courseName || c.cn]
        }))

export const addIdInCourseData = (courseData) => {
    const dict = generateCourseIdDict(courseData);
    return Object.fromEntries(
        Object.entries(courseData)
            .map(kv => [kv[0], addIdInCourseArray(kv[1], dict)])
    );
}


export const scheduleStudentV2Adaptor = (rawData) => {
    console.log('rawData', rawData);
    let generateId = addIdInCourseData(rawData)
    console.log('generateId', generateId);

    const resultData = convertToOldCourseData(generateId)
    console.log('resultData', resultData);
    return resultData
}

export const schedulePostGraduateStudentV2Adaptor = (rawData) => {
    console.log('rawData', rawData);
    let generateId = addIdInCourseData(rawData)
    console.log('generateId', generateId);

    const resultData = convertToOldCourseData(generateId)
    console.log('resultData', resultData);
    return resultData
}

// let oldDataConvertFromNew = {...newData};
// oldDataConvertFromNew.data = convertToOldCourseData(newData.data);

// let newDataConvertFromOld = {...oldData};
// newDataConvertFromOld.data = convertToNewCourseData(oldData.data);