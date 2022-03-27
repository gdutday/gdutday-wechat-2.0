export default function(){
  const admitPageShare = () => {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  } 


  return {
    admitPageShare
  }
}