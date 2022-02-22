import { caculateGPA,averageGPA,search ,getNearestExam} from "@/utils/common";

const handleExam = (exam) => {
  let newArr = [];
  let examIndex = Object.keys(exam);
  for(let i = 0;i<examIndex.length;i++){
    newArr.push(...exam[examIndex[i]]);
  }
  return newArr;
}
export default {
  namespaced: true,
  state:() => ({
    exam:uni.getStorageSync('exam')? uni.getStorageSync('exam'): {},
    currentExam:[],
    futureExam:uni.getStorageSync('futureExam')? uni.getStorageSync('futureExam'): {},
    nearestExam:0,
    GPA:5.0,
    GPAStrength:[],
    GPAOfSix:[],
    scoreHeight:[],
  }),
  mutations: {
    // setGPA(store,payload){
    //   store.GPA = payload.GPA
    // },
     setGPAOfSix(store){
      let examInfo = {};
      examInfo = store.exam;
      let examIndex = Object.keys(examInfo);
      let newArr = [];
      let GPAofSix = [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < examIndex.length; i++) {
      GPAofSix[i] = averageGPA(examInfo[examIndex[i]], "gp"); //这一行用于求平均数
      newArr.push(...examInfo[examIndex[i]]); //这一行用于数组结构
        }
        let GPA = caculateGPA(newArr, "gp"); //这一行用于计算各科的绩点哪个比较高

       store.GPAOfSix = GPAofSix;
       store.GPAStrength = GPA;
     },
    setExam(store,payload){
      store.exam = payload.exam;
    },
    setCurrentExamBySearch(store,payload){
      store.currentExam = search(handleExam(store.exam), "cn", payload.searchValue);
    },
    setFutureExam(store,payload){
      store.futureExam = payload.futureExam;
      console.log(store.futureExam);
      //下面这部分代码用于设置最近的一次考试     
      store.nearestExam = getNearestExam(store.futureExam);
      console.log(store.nearestExam);
    },
    setCurrentExam(store,payload){
      let [isIncludeXuan,grade,term] = payload.termIndex;
      const exam = store.exam;
      console.log(exam);
      let examIndex = Object.keys(exam);
      let newArr = [];
      
      if(grade == 0 && term==0){
        //如果是0，则是所有学期
        //相当于实现一次初始化
        for(let i = 0;i<examIndex.length;i++){
          newArr.push(...exam[examIndex[i]]);
        }
      }
      else{
        let termInfo = [];
        if(term == 0){
          termInfo.push(2*(grade-1),2*grade-1);
          //push两个学期
        }else if(term == 1){
          termInfo.push(2*(grade-1));
          //push上一个学期
        }else{
          termInfo.push(2*grade-1);
          //push后一个学期
        }
        for(let i=0;i<termInfo.length;i++){
          exam[examIndex[termInfo[i]]]?newArr.push(...exam[examIndex[termInfo[i]]]):''
        }
      }
      if(isIncludeXuan == '2')
      {
        newArr = newArr.filter((item,index) => {
          return item.type == '公共选修课'
        })
      }
      if(isIncludeXuan  == '1'){
        newArr = newArr.filter((item,index) => {
          return item.type != '公共选修课'
        })
      }
      store.currentExam = newArr;
      store.scoreHeight = caculateGPA(newArr,'gp');
      store.GPA = averageGPA(newArr,'gp');
    }
  }
}
