import base from './index'
let axios = base.axios
let baseUrl = base.baseUrl

// 根据name查找元素的索引
function findIndexByName(arr, name) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === name || arr[i] === name) {
      return i;
    }
  }
  return -1; // 没有找到对应的元素
}

const desp_model = {"gpt-3.5-turbo": "chatgpt v3.5 所基于的模型",
                    "ada": "自然语言模型，OpenAI提供的最快，最便宜的模型，但性能也最差，含有ada字眼的模型都是基于ada训练而来",
                    "babbage": "自然语言模型，性能比ada强，价格比ada贵，规模比ada大，含有babbage字眼的模型都是基于babbage训练而来",
                    "curie": "自然语言模型，性能优于ada，babbage，价钱也更贵，规模更大，含有curie字眼的模型都是基于curie训练而来",
                    "davinci": "自然语言模型，在ada，babbage，curie和davinci中性能最优，规模最大，速度最慢，价钱最贵，含有davinci字眼的模型都是基于davinci训练而来，目前chatgpt基于davinci微调而来",
                    "whisper-1": "强大的语音转换文本的模型"
                  }
const other_desps = {"code": "的AI代码处理模型",
                  "similarity": "的AI文本相似度计算模型",
                 "document": "的大文档处理模型",
               "text": "的文本处理模型",
             "instruct": "的人工指令微调模型",
           "if": "一个分支"}
const desp_keys = Object.keys(desp_model)
const other_desp_keys = Object.keys(other_desps)

function produceModelDesc(model) {
  const idx = findIndexByName(desp_keys, model)
  if (idx !== -1) {
    return desp_model[model]
  }
  else {
    let desc = '';
    for (let i=0; i<desp_keys.length; i++) {
      const key = desp_keys[i];
      if (model.includes(key)) {
        desc += `基于语言模型${key}`;
        break;
      }
    }
    for (let i=0; i<other_desp_keys.length; i++) {
      const key = other_desp_keys[i];
      if (model.includes(key)) {
        desc += other_desps[key];
        break;
      }
    }
    if (desc == "") {
      desc = model + "模型"
    }
    return desc
  }
}

const statements = ["十五日得半卷诗稿，遇墨迹化魂水中。",
                    "—朝有悟，臻至化境。",
                  "神游千山外，化墨入深潭。",
                "但承青莲有侠志,莫道红尘无剑仙。",
              "—生疏狂尽余欢,半剖肝胆入剑寒。",
            "剑至高危如蜀道，生逢穷途行路难。",
          "江湖风雨染白衫，黑云万里不见天。",
        "宠辱两相忘，所欲随心安。",
      "形神不随尘世改，日月青冥纷纷化入剑中来。",
    "倾尽绿蚁花尽开，问潭底剑仙安在哉?",
  "昨日前事皆可弃，明月松风抱剑来。",
"天地逆旅，过客归人。",
"恩怨随风了无痕。",
"席卷英豪天下来!"]

// 获取模型列表
export const getModels = token => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/models`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }).then(res => {
    const modelsObj=[]
    //获取所有的模型
    const models = [...new Set(res.data.data.map(model => model.id))].sort();
    models.forEach(model => {
      let modelObj={
        img: "",
        name: model,
        detail: produceModelDesc(model),
        lastMsg: model+"模型",
        id: model,
        headImg: require("@/assets/img/ai.png"),
        showHeadImg: true
      }
      modelsObj.push(modelObj)
    });
    // 将gpt-3.5-turbo置顶
    const idx = findIndexByName(modelsObj, "gpt-3.5-turbo")
    if (idx !== -1) {
      const element = modelsObj.splice(idx, 1)[0]; // 将idx元素删除
      modelsObj.unshift(element); // 将idx出的元素至于列表头
    }
    return modelsObj;
  })
}

// 完成对话指令
// export const getChatCompletion = (params,token) => {
//   return axios({
//     method: 'post',
//     baseURL: `${baseUrl}/v1/chat/completions`,
//     headers: {
//       'Authorization': 'Bearer ' + token,
//       'Content-Type': 'application/json'
//     },
//     data: params
//   }).then(res => {
//     console.log("chatgpt说")
//     return res.data.choices[0].message.content;
//   })
// }


// 完成指令
// export const getCompletion = async (params,token) => {
//   const response = await axios({
//     method: 'post',
//     baseURL: `${baseUrl}/v1/completions`,
//     headers: {
//       'Authorization': 'Bearer ' + token,
//       'Content-Type': 'application/json'
//     },
//     responseType: 'text',
//     stream: true,
//     data: params
//   }).then(res => {
//     return res.data.choices[0].text;
//   })
// }


// 根据提示创建图像
export const createImage = (params,token) => {
  console.log(params)
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/images/generations`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    data: params
  }).then(res => {
    return res.data.data;
  })
}

// 根据提示词编辑图像
export const createImageEdit = (formData,token) => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/images/edits`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }).then(res => {
    return res.data.data;
  })
}

// 根据创建图像变体
export const createImageVariations = (formData,token) => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/images/variations`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }).then(res => {
    return res.data.data;
  })
}

// 将音频转换为文字
export const createTranscription = (formData,token) => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/audio/transcriptions`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }).then(res => {
    return res.data;
  })
}

// 将音频翻译成英语
export const createTranslation = (formData,token) => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/audio/translations`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }).then(res => {
    return res.data;
  })
}

// 创建微调
export const createFineTune = (formData,token) => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/fine-tunes`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }).then(res => {
    return res.data;
  })
}


// 列出微调
export const getFineTunesList = (formData,token) => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/fine-tunes`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }).then(res => {
    return res.data;
  })
}


// 列出微调
export const retrieveFineTune = (fineTuneId,token) => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/fine-tunes/`+fineTuneId,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data"'
    },
    data: fineTuneId
  }).then(res => {
    return res.data;
  })
}



// 取消微调
export const cancelFineTune = (fineTuneId,token) => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/fine-tunes/`+fineTuneId+'/cancel',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data"'
    },
    data: fineTuneId
  }).then(res => {
    return res.data;
  })
}

// 取消微调
export const getFineTuneEventsList = (fineTuneId,token) => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/fine-tunes/`+fineTuneId+'/events',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: fineTuneId
  }).then(res => {
    return res.data;
  })
}

// 取消微调
export const deleteFineTuneModel = (model,token) => {
  return axios({
    method: 'delete',
    baseURL: `${baseUrl}/v1/models/`+model,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: model
  }).then(res => {
    return res.data;
  })
}




// 获取账号余额信息
export const getMoneyInfo= token => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/dashboard/billing/credit_grants`,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return res.data;
  })
}


  // 获取聊天信息
export const getChatMsg = params => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/friend/chatMsg`,
    data: params
  }).then(res => res.data)
}