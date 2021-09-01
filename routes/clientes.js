const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// Retorna todos os clientes
router.get('/', (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM clientes;',
            (error,resultado,fields) => {
                if (error) { return res.status(500).send({error: error})}
                return res.status(200).send({response: resultado})
            }
        )
    })

});

// CREATE
router.post('/', (req,res,next) => {

    mysql.getConnection((error,conn) => {
        if (error) { return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO clientes (nome,cpf,sexo,email) VALUES (?,?,?,?)',
            [req.body.nome, req.body.cpf,req.body.sexo,req.body.email],
            (error,resultado,field) => {
                conn.release(); //sempre faça o release, para liberar a conexão poiso o pool tem limite de conexões

                if (error) { return res.status(500).send({error: error})}
                  
                res.status(201).send({
                    mensagem: 'Cliente inserido com sucesso',
                    id_cliente: resultado.insertId
                });
            }
        )
    })


     
});

// READ
router.get('/:id_cliente', (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM clientes WHERE id_cliente = ?;',
            [req.params.id_cliente],
            (error,resultado,fields) => {
                if (error) { return res.status(500).send({error: error})}
                return res.status(200).send({response: resultado})
            }
        )
    })
});

// UPDATE
router.patch('/', (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if (error) { return res.status(500).send({error: error})}
        conn.query(
            'UPDATE clientes SET nome = ?, cpf = ?, sexo = ?, email = ? WHERE id_cliente = ?',
            [req.body.nome, req.body.cpf,req.body.sexo,req.body.email,req.body.id_cliente],
            (error,resultado,field) => {
                conn.release(); 

                if (error) { return res.status(500).send({error: error})}
                  
                res.status(202).send({
                    mensagem: 'Cliente atualizado com sucesso'
                });
            }
        )
    })
});

// DELETE
router.delete('/', (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if (error) { return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM clientes WHERE id_cliente = ?',
            [req.body.id_cliente],
            (error,resultado,field) => {
                conn.release(); 
                if (error) { return res.status(500).send({error: error}) }
                  
                res.status(202).send({
                    mensagem: 'Cliente excluído com sucesso'
                });
            }
        )
    })
});

module.exports = router;