import React, { useState } from "react";
import {Container, Grid, Image, Button, Modal, Form} from "semantic-ui-react";


export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "5vh" }}>
      <Container textAlign="center" style={{ paddingTop: "5%" }}>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={8}>
              
              {/* Imagem opcional */}
              <Image
                src=""
                size="medium"
                centered
              />

                 {/* Mensagem */}
              <h2 style={{ marginTop: "20px" }}>
                Inicio - Meus Agendamentos
              </h2>

              {/* Mensagem */}
              <h4 style={{ marginTop: "20px" }}>
                Nenhuma sala reservada no momento
              </h4>

              {/* Botão */}
              <Button
                primary
                style={{ marginTop: "20px" }}
                onClick={() => setOpen(true)}
              >
                + Agendar Aula
              </Button>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      {/* Modal com formulário */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Reservar Sala</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Nome da Sala"
              placeholder="Digite o nome da sala"
            />
            <Form.Input
              label="Data"
              type="date"
            />
            <Form.Input
              label="Horário"
              type="time"
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button primary onClick={() => setOpen(false)}>
            Confirmar
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}