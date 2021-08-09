/** Enum of supported mime types.
 * @enum {string}
 * @see {@link https://www.iana.org/assignments/media-types/media-types.xhtml Internet Assigned Numbers Authority Media Types}
*/
export const MIME_TYPES = {
  MP4: 'video/mp4',
  HLS: 'application/vnd.apple.mpegurl',
  DASH: 'application/dash+xml',
}

export const MIME_TYPES_BY_EXTENSION = {
  m3u8: MIME_TYPES.HLS,
  m3u: MIME_TYPES.HLS,
  mp4: MIME_TYPES.MP4,
  mpd: MIME_TYPES.DASH,
}

export const getExtension = url => {
  const urlWithoutParameters = url.split('?')[0] //eslint-disable-line
  const match = urlWithoutParameters.match(/(\.[A-Z0-9]+)/gi)
  const extension = match ? match.pop().replace('.', '') : ''

  return extension
}