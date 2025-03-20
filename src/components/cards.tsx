import { useNavigate, useParams } from "react-router";
import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react"
import { FaGithub, FaTwitter,  } from "react-icons/fa";
import { IconButton, Tooltip, HStack, Text , Box, Button} from "@chakra-ui/react";

// これ別のところに切り出そう
type UserInfo = {
  user_id: string; 
  name: string; 
  description: string;
  skill_name: string;
  github_id: string; 
  qiita_id: string; 
  x_id: string; 
};

const Cards = () => {

  const [loading, setLoading] = useState(true);
  const params_id = useParams()
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const navigate = useNavigate();
  const navigateToHome = () => navigate("/");

  useEffect(() => {
      const fetchSkills = async () => {
        const { data: skillIdData, error: skillIdError } = await supabase
              .from("user_skill")
              .select("skill_id")
              .eq("user_id", params_id.id);
              console.log("🔍 skillIdData:", skillIdData);
        console.log(params_id);
        if (skillIdError) {
          console.error("❌ Error fetching skill IDs:", skillIdError);
          return;
        }
        const skill_id = skillIdData[0].skill_id;
        // console.log("🔍 skill_id:", skill_id);

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
      setLoading(false);
    }, []);

  if (loading) {
    console.log("loading...");
    return <Spinner />;
  }

  if (!userInfo) {
    return <p>ユーザー情報が見つかりません</p>;
  }
    
  return (
  <>
    {loading ? (
      <Spinner />
    ) : !userInfo ? (
      <p>ユーザー情報が見つかりません</p>
    ) : (
      <>
        <Box 
    maxWidth="90%" 
    mx="auto" 
    my={6} 
    p={4} 
    borderWidth="10px" 
    borderRadius="1g"
    textAlign="center"
  >
    {/* ボックス便利やな */}
    <Box textAlign="left"> 
      <Text fontSize="xl" fontWeight="bold" mb={4} data-testid="self-name">{userInfo.name}</Text>
      <Text fontSize="md" fontWeight="bold" data-testid="self-introduce">自己紹介</Text>
      <Text fontSize="md" mb={4} dangerouslySetInnerHTML={{ __html: userInfo.description }} />
      <Text fontSize="md" fontWeight="bold" data-testid="like-stack">好きな技術</Text>
    </Box>
    <HStack spacing={4} mt={4} justifyContent="space-between">
      {/* GitHub */}
      {userInfo.github_id && (
        <Tooltip label="GitHub" aria-label="GitHub">
          <IconButton
            as="a"
            href={`https://github.com/${userInfo.github_id}`}
            target="_blank"
            rel="noopener noreferrer"
            icon={<FaGithub />}
            aria-label="GitHub"
            size="lg"
            colorScheme="gray"
            variant="outline"
          />
        </Tooltip>
      )}
      {/* X (Twitter) */}
      {userInfo.x_id && (
        <Tooltip label="X (Twitter)" aria-label="X (Twitter)">
          <IconButton
            as="a"
            href={`https://x.com/${userInfo.x_id}`}
            target="_blank"
            rel="noopener noreferrer"
            icon={<FaTwitter />}
            aria-label="X (Twitter)"
            size="lg"
            colorScheme="blue"
            variant="outline"
          />
        </Tooltip>
      )}
      {/* Qiita */}
      {userInfo.qiita_id && (
        <Tooltip label="Qiita" aria-label="Qiita">
          <IconButton
            as="a"
            href={`https://Qiita.com/${userInfo.x_id}`}
            target="_blank"
            rel="noopener noreferrer"
            icon={<Spinner />}
            aria-label="X (Twitter)"
            size="lg"
            colorScheme="blue"
            variant="outline"
          />
        </Tooltip>
      )}
    </HStack>
  </Box>
  <Button onClick={navigateToHome}>戻る</Button>
      </>
    )}
  </>
);

};

export default Cards;