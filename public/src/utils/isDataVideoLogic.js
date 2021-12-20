export default (data) => {
  if (!data || !data.data) return false
  const splitData = data.data.split('/')
  const fileName = splitData[splitData.length - 1]
  const fileSplit = fileName.split('.')
  const fileExtension = fileSplit[fileSplit.length - 1]

  const videoExtensions = [
    'WEBM', 'MPG', 'MP2', 'MPEG', 'MPE', 'MPV', 'OGG', 'MP4', 'M4P', 'M4V', 'AVI', 'WMV', 'MOV', 'QT', 'FLV', 'SWF', 'AVCHD',
  ]

  return videoExtensions.some(extension => extension.toLowerCase() === fileExtension.toLowerCase())
}