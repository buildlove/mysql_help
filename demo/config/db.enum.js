// 数据库字段
module.exports = {
  user: {
    userid: "",
    username: "",
    password: "",
    sex: "",
    mail: "",
    phone: "",
    create_time: "",
    last_login_time: "",
    authorized: ""
  },
  role: {
    role_id: "",
    role_code: "",
    role_name: "",
    remark: ""
  },
  photo: {
    photo_id: "",
    photo_size: "",
    photo_format: "",
    photo_width: "",
    photo_height: "",
    photo_link: "",
    photo_name: "",
    photo_qiniu_link: "",
    create_time: "",
    remark: ""
  },
  video: {
    id: "",
    size: "",
    format: "",
    userid: "",
    link: "",
    name: "",
    hash: "",
    create_time: "",
  },
  resource: {
    resource_id: "",
    parent_id: "",
    resource_code: "",
    resource_name: "",
    remark: ""
  },
  album: {
    album_id: "",
    founder_id: "",
    is_private: "",
    album_name: "",
    album_home_link: "",
    remark: "",
    create_time: "",
  },
  album_photo: {
    id: "",
    photo_id: "",
    album_id: "",
    remark: ""
  },
  role_resource: {
    id: "",
    role_id: "",
    resource_id: "",
    authorized: "",
    remark: ""
  },
  user_role: {
    id: "",
    user_id: "",
    role_id: "",
    remark: ""
  },
  intercepting: {
    id: "",
    require_host: "",
    require_user_agent: "",
    require_time: "",
    require_api: "",
    require_params: "",
    require_cookies: "",
    require_headers: "",
  },
  video_img: {
    id: "",
    width: "",
    height: "",
    name: "",
    shooting_time: "",
    duration: "",
    remark: "",
    path: ""
  },
  article: {
    id: "",
    author: "",
    image: "",
    description: "",
    link: "",
    pubdata: "",
    rss: ""
  },
  article_site: {
    id: "",
    rss: "",
    title: "",
    link: ""
  },
  tags: {
    id: "",
    category: "",
    remark: "",
    userid: ""
  },
  market: {
    id: "",
    title: "",
    praise: "",
    create_time: "",
    type: "",
    decs: "",
    link: "",
    author: "",
    content: ""
  }
}