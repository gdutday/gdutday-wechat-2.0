import {getStorageSync} from '@/utils/common'

export const time = [
  //大学城校区，番禺校区
  [
    ['8:30', '9:15'],
    ['9:20', '10:05'],
    ['10:25', '11:10'],
    ['11:15', '12:00'],
    ['13:50', '14:35'],
    ['14:40', '15:25'],
    ['15:30', '16:15'],
    ['16:30', '17:15'],
    ['17:20', '18:05'],
    ['18:30', '19:15'],
    ['19:20', '20:05'],
    ['20:10', '20:55'],
  ],
  //龙洞校区或东风路小区
  [
    // ['8:15', '9:00'],
    // ['9:05', '9:50'],
    // ['10:10', '10:55'],
    // ['11:00', '11:45'],
    // ['13:30', '14:15'],
    // ['14:20', '15:05'],
    // ['15:10', '15:55'],
    // ['16:15', '17:00'],
    // ['17:05', '17:50'],
    // ['18:30', '19:15'],
    // ['19:20', '20:05'],
    // ['20:10', '20:55'],
    ['8:30', '9:15'],
    ['9:20', '10:05'],
    ['10:25', '11:10'],
    ['11:15', '12:00'],
    ['13:50', '14:35'],
    ['14:40', '15:25'],
    ['15:30', '16:15'],
    ['16:30', '17:15'],
    ['17:20', '18:05'],
    ['18:30', '19:15'],
    ['19:20', '20:05'],
    ['20:10', '20:55'],
  ],
  //番禺校区
  [
    // ['8:30', '9:15'],
    // ['9:20', '10:05'],
    // ['10:20', '11:05'],
    // ['11:10', '11:55'],
    // ['13:40', '14:25'],
    // ['14:30', '15:15'],
    // ['15:20', '16:05'],
    // ['16:15', '17:00'],
    // ['17:05', '17:50'],
    // ['18:30', '19:15'],
    // ['19:20', '20:05'],
    // ['20:10', '20:55'],
    ['8:30', '9:15'],
    ['9:20', '10:05'],
    ['10:25', '11:10'],
    ['11:15', '12:00'],
    ['13:50', '14:35'],
    ['14:40', '15:25'],
    ['15:30', '16:15'],
    ['16:30', '17:15'],
    ['17:20', '18:05'],
    ['18:30', '19:15'],
    ['19:20', '20:05'],
    ['20:10', '20:55'],
  ],
]

const dongTime = [
  '8:15',
  '9:50',
  '10:10',
  '11:45',
  '13:30',
  '14:20',
  '15:55',
  '16:15',
  '17:50',
  '18:30',
  '20:05',
  '20:55',
]

const panTime = [
  '8:30',
  '10:05',
  '10:20',
  '11:55',
  '13:40',
  '14:30',
  '16:05',
  '16:15',
  '17:50',
  '19:00',
  '20:35',
  '21:25',
]

const jyTime = [
  '8:30',
  '10:05',
  '10:25',
  '12:00',
  '13:50',
  '14:40',
  '16:15',
  '16:30',
  '18:05',
  '18:30',
  '20:05',
  '20:55',
]

export const openningDate = () => {
  return getStorageSync('platform') == 'ios' ? '2024/2/26' : '2024.2.26'
}
