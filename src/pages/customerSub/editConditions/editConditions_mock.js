const PaeList = [  // 注释
    {
      "groupName": "消费条件",
      "configs": [
        {
          "code": "CRC001",
          "conditionName": "近几月新预订",
          "condition": "近i1月新预订",
          "order": 1,
          "sql": "SELECT t.CstId FROM (SELECT CY20002 AS CstId,MIN(CY20005) as firsttime FROM CY20 t WHERE CY20018 = '{0}' AND CY20020 IN ( 2, 3, 4 ) GROUP BY CY20002) t WHERE t.firsttime BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE()",
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC003",
          "conditionName": "近几月桌均",
          "condition": "近i1个月平均消费金额s2m3",
          "sql": "SELECT t.CstId FROM (SELECT CY20002 as CstId,AVG(CY20014) AS Total FROM dbo.CY20 WHERE CY20018='{0}' AND CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND CY20020 IN (2,3,4) GROUP BY CY20002) t WHERE t.Total{2}{3} ",
          "order": 3,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int",
            },
            {
              "fieldName": "条件",
              "fieldKey": "s2",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于", "小于", "等于" ]
            },
            {
              "fieldName": "金额",
              "fieldKey": "m3",
              "fieldType": "money"
            }
          ]
        },
        {
          "code": "CRC006",
          "conditionName": "近几月消费金额",
          "condition": "近i1个月消费金额s2m3",
          "sql": "SELECT DISTINCT CY20002 as CstId FROM dbo.CY20 WHERE CY20018='{0}' AND CY20020 IN (2,3,4) AND CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND CY20014{2}{3}",
          "order": 6,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            },
            {
              "fieldName": "条件",
              "fieldKey": "s2",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于", "小于", "等于" ]
            },
            {
              "fieldName": "金额",
              "fieldKey": "m3",
              "fieldType": "money"
            }
          ]
        },
        {
          "code": "CRC007",
          "conditionName": "近几月消费次数",
          "condition": "近i1个月消费次数s2i3",
          "sql": " SELECT CY20002 AS  CstId FROM ( SELECT CY20002,COUNT(1) AS FeeCount FROM dbo.CY20 WHERE CY20018='{0}' AND CY20020 IN (2,3,4) AND CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() GROUP BY CY20002) t WHERE t.FeeCount{2}{3}",
          "order": 7,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            },
            {
              "fieldName": "条件",
              "fieldKey": "s2",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于", "小于", "等于" ]
            },
            {
              "fieldName": "次数",
              "fieldKey": "i3",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC009",
          "conditionName": "近几月喜欢周几来",
          "condition": "近i1个月喜欢周i2来的次数超过3次",
          "sql": "SET DATEFIRST 1;SELECT CstId from (SELECT CY20002 as CstId,COUNT(CY20002) AS cc FROM dbo.CY20 WHERE CY20018='{0}' and CY20020 IN (2,3,4) and CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND datepart(WEEKDAY,CY20005)={2} GROUP BY CY20002) t WHERE t.cc>3",
          "order": 9,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            },
            {
              "fieldName": "周几",
              "fieldKey": "i2",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC010",
          "conditionName": "近几月预订【包房类型】超过几次",
          "condition": "近i1个月预订a2次数s3i4次",
          "sql": "SELECT CstId from (SELECT cy20.CY20002 as CstId,COUNT(cy20.CY20002) AS cc FROM dbo.CY20 cy20 LEFT OUTER JOIN dbo.CY08 cy08 ON cy20.CY20007=cy08.CY08001 LEFT OUTER JOIN dbo.CY83 cy83 ON cy08.CY08010=cy83.TableTypeID WHERE cy20.CY20018='{0}' and cy20.CY20020 IN (2,3,4) and cy20.CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND cy83.TableTypeID='{2}' GROUP BY cy20.CY20002) t WHERE t.cc>{3}",
          "order": 10,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            },
            {
              "fieldName": "包房类型",
              "fieldKey": "a2",
              "fieldType": "ajax",
              "ajaxOpt": {
                "ajaxUrl": "/api/services/app/CY83/GetViewPage",
                "ajaxParameter": [ "storeID" ],
                "controlType": "select",
                "selectKeyValue": {
                  "keyName": "tableTypeID",
                  "valueName": "tableTypeName"
                }
              }
            },
            {
              "fieldName": "条件",
              "fieldKey": "s3",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于" ]
            },
            {
              "fieldName": "次数",
              "fieldKey": "i4",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC011",
          "conditionName": "近几月预订【餐别】超过几次",
          "condition": "近i1个月预订a2次数s3i4次",
          "sql": "SELECT CstId FROM (SELECT cy20.CY20002 AS CstId,COUNT(cy20.CY20002) AS cc FROM dbo.CY20 cy20 LEFT OUTER JOIN dbo.CY23 cy23 ON cy20.CY20006 = cy23.DiningTypeID WHERE cy20.CY20018 = '{0}' AND cy20.CY20020 IN ( 2, 3, 4 ) AND cy20.CY20005 BETWEEN DATEADD(MONTH, -{1}, GETDATE()) AND GETDATE() AND cy23.DiningTypeID = {2} GROUP BY cy20.CY20002) t WHERE t.cc > {3}",
          "order": 11,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            },
            {
              "fieldName": "餐别",
              "fieldKey": "a2",
              "fieldType": "ajax",
              "ajaxOpt": {
                "ajaxUrl": "/api/services/app/CY23/GetViewPage",
                "ajaxParameter": [ "storeID" ],
                "controlType": "select",
                "selectKeyValue": {
                  "keyName": "diningTypeID",
                  "valueName": "name"
                }
              }
            },
            {
              "fieldName": "条件",
              "fieldKey": "s3",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于" ]
            },
            {
              "fieldName": "i4",
              "fieldKey": "4",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC012",
          "conditionName": "近几月预订【类别】超过几次",
          "condition": "近i1个月预订a2s3i4次",
          "sql": "SELECT CstId FROM (SELECT cy20.CY20002 AS CstId,COUNT(cy20.CY20002) AS cc FROM dbo.CY20 cy20 LEFT OUTER JOIN dbo.CY26 cy26 ON cy20.CY20026 = cy26.BookOrderTypeID WHERE cy20.CY20018 = '{0}' AND cy20.CY20020 IN ( 2, 3, 4 ) AND cy20.CY20005 BETWEEN DATEADD(MONTH, -{1}, GETDATE()) AND GETDATE() AND cy26.BookOrderTypeType = {2} GROUP BY cy20.CY20002) t WHERE t.cc > {3}",
          "order": 12,
          "fields": [
            {
              "fieldName": "i1",
              "fieldKey": "1",
              "fieldType": "int"
            },
            {
              "fieldName": "类别",
              "fieldKey": "a2",
              "fieldType": "ajax",
              "ajaxOpt": {
                "ajaxUrl": "/api/services/app/CY26/GetBookOrderTypeList",
                "ajaxParameter": [],
                "controlType": "select",
                "selectKeyValue": {
                  "keyName": "name",
                  "valueName": "value"
                }
              }
            },
            {
              "fieldName": "条件",
              "fieldKey": "s3",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于" ]
            },
            {
              "fieldName": "次数",
              "fieldKey": "i4",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC014",
          "conditionName": "近几月单餐次桌数超过几次",
          "condition": "近i1个月单餐次桌数s2i3",
          "sql": "SELECT DISTINCT CY20002 as CstId FROM dbo.CY20 WHERE CY20018='{0}' AND CY20020 IN (2,3,4) AND CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND CY20027 > {2}",
          "order": 14,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            },
            {
              "fieldName": "条件",
              "fieldKey": "s2",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于" ]
            },
            {
              "fieldName": "次数",
              "fieldKey": "i3",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC015",
          "conditionName": "近几月【预订类型】超过几次",
          "condition": "近i1个月预订a2s3i4",
          "sql": "SELECT CstId from (SELECT cy20.CY20002 as CstId,COUNT(cy20.CY20002) AS cc FROM dbo.CY20 cy20 LEFT OUTER JOIN dbo.CY26 cy26 ON cy20.CY20026=cy26.BookOrderTypeID WHERE cy20.CY20018='{0}' and cy20.CY20020 IN (2,3,4) and cy20.CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND cy26.BookOrderTypeID='{2}' GROUP BY cy20.CY20002) t WHERE t.cc>{3}",
          "order": 15,
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldDbType": "int"
            },
            {
              "fieldName": "预订类型",
              "fieldKey": "a2",
              "fieldDbType": "ajax",
              "ajaxOpt": {
                "ajaxUrl": "/api/services/app/CY26/GetViewPage",
                "ajaxParameter": [ "storeID" ],
                "controlType": "select",
                "selectKeyValue": {
                  "keyName": "bookOrderTypeID",
                  "valueName": "name"
                }
              }
            },
            {
              "fieldName": "条件",
              "fieldKey": "s3",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于" ]
            },
            {
              "fieldName": "次数",
              "fieldKey": "i4",
              "fieldType": "int"
            }
          ]
        }
      ]
    },
    {
      "groupName": "客户条件",
      "configs": [
        {
          "code": "CRC005",
          "conditionName": "客户等级",
          "condition": "客户等级s1i2",
          "sql": "SELECT DISTINCT CY19001 AS CstId FROM  dbo.CY19  WHERE CY19012=(SELECT TOP 1  GZH09023 FROM dbo.GZH09 WHERE gzh09001='{0}') AND CY19020{1}'{2}'",
          "order": 5,
          "type": 1, //为1 表示 大于和小于互换
          "fields": [
            {
              "fieldName": "条件",
              "fieldKey": "s1",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于", "小于", "等于" ]
            },
            {
              "fieldName": "等级",
              "fieldKey": "i2",
              "fieldType": "int"
            }
          ]
        },
        {
          "code": "CRC008",
          "conditionName": "客户年龄",
          "condition": "客户年龄s1i2",
          "sql": "SELECT DISTINCT CY19001 AS CstId FROM  dbo.CY19 WHERE CY19012=(SELECT TOP 1  GZH09023 FROM dbo.GZH09 WHERE gzh09001='{0}') AND DATEDIFF(YEAR,CY19013,GETDATE()){1}{2}",
          "order": 8,
          "fields": [
            {
              "fieldName": "条件",
              "fieldKey": "s1",
              "fieldType": "select",
              "fieldDefaultValue": [ "大于", "小于", "等于" ]
            },
            {
              "fieldName": "年龄",
              "fieldKey": "i2",
              "fieldType": "int"
            }
          ]
        }
      ]
    },
    {
      "groupName": "跟踪条件",
      "configs": [
        {
          "code": "CRC013",
          "conditionName": "近几月未联系",
          "condition": "近i1个月未联系过",
          "order": 13,
          "sql": "SELECT CY19001 as CstId FROM dbo.CY19 LEFT JOIN dbo.CY17 ON CY19007 = CY17001 WHERE CY17008 = '{0}' AND not exists (SELECT DISTINCT CustomerId FROM dbo.CY57 WHERE CallType IN (2,3,5) AND StoreId = '{0}' AND BeginTime BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND CustomerId is NOT null AND CY19001=CustomerId)",
          "fields": [
            {
              "fieldName": "近几月",
              "fieldKey": "i1",
              "fieldType": "int"
            }
          ]
        }
      ]
    }
  ]

export default {
    PaeList,
}

