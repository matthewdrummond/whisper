//retrieve user from the database, based on signed in ID
const user = {
  username: "schizi_user",
  profile_picture: "https://images.unsplash.com/photo-1520974735194-9e0ce82759fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
}


let database = {
  users: {
    123: {
      name: "Schizi User",
      username: "schizi_user",
      password: "DOI##*C?/SE",
      profile_picture: "https://images.unsplash.com/photo-1520974735194-9e0ce82759fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      settings: {
        name: "Schizi User",
        nicknames: "schizi, skizzy",
        whisperFrequency: 10,
        whisperFilter: "Depression, Jealousy",
        devices: [
          {"serial": 123456789, "name": "POP Bone Conduction Headphones", "volume": 8, }
        ]
      }
    },
    0: {
      username: "system",
      profile_picture: "https://static.vecteezy.com/system/resources/previews/000/587/211/original/vector-cog-wheel-icon.jpg",
    },
  },
  chats: {
    123: [
      {
        "title": "First Entry",
        "lastModified": 12345678,
        "posts": [
          {"date": 12345678, "sender": 123, "postText": "Hello World", "imgSrc": "https://www.civitatis.com/blog/wp-content/uploads/2022/07/portada-atardecer-nueva-york-1920x1280.jpg"},
          {"date": 12345678, "sender": 123, "postText": "Just going about my day", "imgSrc": "https://www.civitatis.com/blog/wp-content/uploads/2022/07/portada-atardecer-nueva-york-1920x1280.jpg"},
          {"date": 12345678, "sender": 123, "postText": "Doing what I must do", "imgSrc": ""},
          {"date": 12345678, "sender": 123, "postText": "to get along", "imgSrc": ""},
          {"date": 12345678, "sender": 123, "postText": "Hello World", "imgSrc": ""},
        ]
      },
      {
        "title": "An Awkward Tuesday",
        "lastModified": 12345678,
        "posts": [
          {"date": 12345678, "sender": 123, "postText": "Hello 2nd Chat", "imgSrc": "https://www.civitatis.com/blog/wp-content/uploads/2022/07/portada-atardecer-nueva-york-1920x1280.jpg"},
          {"date": 12345678, "sender": 123, "postText": "Just going 2nd Chat", "imgSrc": "https://www.civitatis.com/blog/wp-content/uploads/2022/07/portada-atardecer-nueva-york-1920x1280.jpg"},
          {"date": 12345678, "sender": 123, "postText": "Doing what I 2nd Chat", "imgSrc": ""},
          {"date": 12345678, "sender": 123, "postText": "2nd Chat", "imgSrc": ""},
          {"date": 12345678, "sender": 123, "postText": "Hello 2nd Chat", "imgSrc": ""},
        ]
      },
    ]
  },
  whispers: {
    123: [
      {"date": 12345678, "sender": 0, "postText": "Keep it up. Youre wonderful", "imgSrc": ""},
      {"date": 12345678, "sender": 0, "postText": "Do what you must", "imgSrc": ""},
      {"date": 12345678, "sender": 0, "postText": "Good day good day", "imgSrc": ""},
      {"date": 12345678, "sender": 123, "postText": "Thanks for the posts. Can you compliment me more?", "imgSrc": ""},
      {"date": 12345678, "sender": 0, "postText": "Yes, I can compliment you more", "imgSrc": ""},
    ]
  }
}
