import { Flex } from "@chakra-ui/react"
import { FaGithub, FaTwitter,  } from "react-icons/fa";
import { IconButton, Tooltip, HStack, Text , Box, Button} from "@chakra-ui/react";
import CardsHook from '../hooks/CardsHook'

const Cards = () => {
  
  const {userInfo, navigateToHome, loading, Icon} = CardsHook()

  if(loading){
    return <Icon/>
  }else if(!userInfo){
    return <p>ユーザー情報が見つかりません</p>;
  }else {
    return (
  <>
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
        {/* 自己紹介ボックス */}
        <Box textAlign="left"> 
          <Text fontSize="md" fontWeight="bold" data-testid="self-introduce">名前</Text>
          <Text fontSize="xl" fontWeight="medium" mb={4} data-testid="self-name">{userInfo.user_name}</Text>
          <Text fontSize="md" fontWeight="bold" data-testid="self-introduce">自己紹介</Text>
          <Text fontSize="md" mb={4} dangerouslySetInnerHTML={{ __html: userInfo.description }} />
          <Text fontSize="md" fontWeight="bold" data-testid="like-stack">好きな技術</Text>
          <Text fontSize="xl" fontWeight="medium" mb={4} data-testid="self-name">{userInfo.skill}</Text>
        </Box>
        
        {/* 各種SNS */}
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

          {/* X */}
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
                href={`https://Qiita.com/${userInfo.qiita_id}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={<Icon/>}
                aria-label="Qiita"
                size="lg"
                colorScheme="blue"
                variant="outline"
              />
            </Tooltip>
          )}
          </HStack>
        
        <Flex justify="flex-start" mt={4}>
          <Button height="10" _hover={{ bg: "blue.400" }} onClick={navigateToHome}>
            戻る
          </Button>
        </Flex>
      </Box>
    </>
  </>
);
  }
  

};

export default Cards;
