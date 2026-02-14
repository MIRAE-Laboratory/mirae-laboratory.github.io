import React from "react";
import { Card } from "react-bootstrap";
import { Icon } from "@iconify/react";

const ProjectCard = ({ name, description, url, demo, image }) => (
  <Card className="h-100 shadow-sm">
    {image && <Card.Img variant="top" src={image} alt={name} />}
    <Card.Body className="text-center">
      <Card.Title>{name}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {demo && (
        <Card.Link href={demo}>Live Demo <Icon icon="icon-park-outline:code-computer" /></Card.Link>
      )}
    </Card.Body>
    <Card.Footer className="text-center">
      <Card.Link href={url}>View on GitHub <Icon icon="icomoon-free:github" /></Card.Link>
    </Card.Footer>
  </Card>
);

export default ProjectCard;
