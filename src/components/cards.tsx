import { useParams } from "react-router";
import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";


const Cards = () => {

  type UserInfo = {
  user_id: string; 
  name: string; 
  description: string;
  skill_name: string;
  github_id: string; 
  qiita_id: string; 
  x_id: string; 
};

const params_id = useParams()
const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  useEffect(() => {
      const fetchSkills = async () => {
        const { data: skillIdData, error: skillIdError } = await supabase
              .from("user_skill")
              .select("skill_id")
              .eq("user_id", params_id.id);
              console.log("🔍 skillIdData:", skillIdData);
        if (skillIdError) {
          console.error("❌ Error fetching skill IDs:", skillIdError);
          return;
        }
        const skill_id = skillIdData[0].skill_id;
        console.log("🔍 skill_id:", skill_id);
          
        const { data: skillData, error: skillError } = await supabase
              .from("skills")
              .select("name")
              .eq("id", skill_id);
              console.log("🔍 skillData:", skillData)
            if (skillError) {
              console.error("❌ Error fetching skills:", skillError);
              return;
            }
        const skill_name = skillData[0].name;
        console.log("🔍 skill_name:", skill_name);

        const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("user_id", params_id.id);
              console.log("🔍 userData:", userData);
            if (userError) {
              console.error("❌ Error fetching users:", userError);
              return;
            }
            console.log("🔍 userData:", userData);
            setUserInfo({
              user_id: userData[0].user_id,
              name: userData[0].name,
              description: userData[0].description,
              skill_name: skill_name,
              github_id: userData[0].github_id,
              qiita_id: userData[0].qiita_id,
              x_id: userData[0].x_id,
            });
      }
      fetchSkills();
    }, []);
    
  return (
    <>
      <p>名前:{userInfo.name}</p>
      <p>自己紹介:{userInfo.description}</p>
      <p>スキル:{userInfo.skill_name}</p>
      <p>GitHub:{userInfo.github_id}</p>
      <p>Qiita:{userInfo.qiita_id}</p>
      <p>X Tech:{userInfo.x_id}</p>
    </>
  );
};

export default Cards;