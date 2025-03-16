import { Button, HStack } from "@chakra-ui/react"
import { supabase } from "./utils/supabase"
import { useEffect, useState } from "react";

const App = () => {

  const [skills, setSkills] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from("skills").select("*");
      
      if (error) {
        console.error("Error fetching skills:", error);
      } else {
        setSkills(data);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      <HStack>
      <Button>Click me</Button>
      <Button>Click me</Button>
    </HStack>
    <li>
      {skills.map((skill) => (
        <div key={skill.id}>{skill.name}</div>
      ))}
    </li>
    </>
  )
}

export default App