import {transformTermIdWithZero} from '../../termId'

const TermMap = {
    '秋季': '01',
    '春季': '02'
}

const gradeObjectMap = {
    "courseName": "cn",
    "courseType": "cType",
    "gpa": "gp",
}

export const convertGradeV2 = (gradeObject, params) => {
    if (!gradeObject) return null

    const copyObject = {}

    try {
        Object.keys(gradeObject).forEach((gradeKey) => {
            let handlegradeKey = gradeKey
            let firstFour = handlegradeKey.slice(0, 4); // 获取前四位
            let rest = handlegradeKey.slice(4); // 获取剩余位

            // 替换为Map
            const restConvert = TermMap[rest]

            if (restConvert === '02') {
                firstFour--
            }

            if (!restConvert) {
                throw new Error('无映射关系')
            }

            const newKey = [firstFour, restConvert].join('')

            copyObject[newKey] = gradeObject[gradeKey].map((item) => {
                return converGradeItem({
                    ...item,
                    term: newKey,
                })
            })
        })

        return copyObject
    } catch (e) {
        console.log('err', 'err');
    }

    return null
}

export const convertPostGraduateGradeV2 = (gradeObject, params) => {
    if (!gradeObject) return null

    const copyObject = {}

    try {
        Object.keys(gradeObject).forEach((gradeKey) => {
            let newKey = transformTermIdWithZero(gradeKey)

            copyObject[newKey] = gradeObject[gradeKey].map((item) => {
                return converGradeItem({
                    ...item,
                    term: newKey,
                })
            })
        })

        return copyObject
    } catch (e) {
        console.log('err', 'err');
    }

    return null
}

const converGradeItem = (gradeObject) => {
    const copyObject = {...gradeObject}

    Object.keys(gradeObjectMap).forEach((rawKey) => {
        const value = gradeObject[rawKey]
        const targetKey = gradeObjectMap[rawKey]

        delete copyObject[rawKey]
        copyObject[targetKey] = value
    })

    return copyObject
}