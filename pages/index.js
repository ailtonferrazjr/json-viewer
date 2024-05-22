import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import fs from 'fs';
import path from 'path';
import styled from 'styled-components';

const JSONViewer = dynamic(() => import('react-json-view'), { ssr: false });

const Container = styled.div`
  padding: 20px;
`;

const TabList = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  margin-right: 10px;
  padding: 10px;
  border: none;
  background-color: ${(props) => (props.active ? '#0070f3' : '#ddd')};
  color: ${(props) => (props.active ? '#fff' : '#000')};
  cursor: pointer;
  &:hover {
    background-color: #0070f3;
    color: #fff;
  }
`;

export async function getStaticProps() {
  const files = fs.readdirSync(path.join(process.cwd(), 'jsons'));
  const jsonData = files.map((file) => {
    const content = fs.readFileSync(path.join(process.cwd(), 'jsons', file), 'utf-8');
    return {
      name: file,
      content: JSON.parse(content),
    };
  });
  return { props: { jsonData } };
}

const Home = ({ jsonData }) => {
  const [selectedTab, setSelectedTab] = useState(jsonData[0]?.name);

  const handleTabClick = (name) => {
    setSelectedTab(name);
  };

  const selectedJson = jsonData.find((json) => json.name === selectedTab);

  return (
    <Container>
      <TabList>
        {jsonData.map((json) => (
          <Tab
            key={json.name}
            active={json.name === selectedTab}
            onClick={() => handleTabClick(json.name)}
          >
            {json.name}
          </Tab>
        ))}
      </TabList>
      {selectedJson && <JSONViewer src={selectedJson.content} collapsed={true} />}
    </Container>
  );
};

export default Home;
