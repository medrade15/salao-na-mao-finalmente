const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws');
const Servico = require('../models/servico');
const Arquivos = require('../models/arquivos');
const moment = require('moment');

/*
  FAZER NA #01
*/
router.post('/', async (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('finish', async () => {
    try {
      let errors = [];
      let arquivos = [];
      const hasAws = aws.IAM_USER_KEY && aws.IAM_USER_SECRET && aws.BUCKET_NAME;

      if (hasAws && req.files && Object.keys(req.files).length > 0) {
        for (let key of Object.keys(req.files)) {
          const file = req.files[key];

          const nameParts = file.name.split('.');
          const fileName = `${new Date().getTime()}.${
            nameParts[nameParts.length - 1]
          }`;
          const path = `servicos/${req.body.salaoId}/${fileName}`;

          const response = await aws.uploadToS3(
            file,
            path
            //, acl = https://docs.aws.amazon.com/pt_br/AmazonS3/latest/dev/acl-overview.html
          );

          if (response.error) {
            // Ignora erro de upload para permitir criação do serviço
            console.log('Upload falhou, prosseguindo sem arquivo:', response.message);
          } else {
            arquivos.push(path);
          }
        }
      }

      // CRIAR SERVIÇO
      let jsonServico = JSON.parse(req.body.servico);
      jsonServico.salaoId = req.body.salaoId;
      const servico = await new Servico(jsonServico).save();

      // CRIAR ARQUIVO
      if (arquivos.length > 0) {
        arquivos = arquivos.map((arquivo) => ({
          referenciaId: servico._id,
          model: 'Servico',
          arquivo,
        }));
        await Arquivos.insertMany(arquivos);
      }

      res.json({ error: false, arquivos });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
});

/*
  FAZER NA #01
*/
router.put('/:id', async (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('finish', async () => {
    try {
      let errors = [];
      let arquivos = [];
      const hasAws = aws.IAM_USER_KEY && aws.IAM_USER_SECRET && aws.BUCKET_NAME;

      if (hasAws && req.files && Object.keys(req.files).length > 0) {
        for (let key of Object.keys(req.files)) {
          const file = req.files[key];

          const nameParts = file.name.split('.');
          const fileName = `${new Date().getTime()}.${
            nameParts[nameParts.length - 1]
          }`;
          const path = `servicos/${req.body.salaoId}/${fileName}`;

          const response = await aws.uploadToS3(
            file,
            path
            //, acl = https://docs.aws.amazon.com/pt_br/AmazonS3/latest/dev/acl-overview.html
          );

          if (response.error) {
            // Ignora erro de upload para permitir atualização do serviço
            console.log('Upload falhou, prosseguindo sem arquivo:', response.message);
          } else {
            arquivos.push(path);
          }
        }
      }

      //  ATUALIZAR SERVIÇO
      let jsonServico = JSON.parse(req.body.servico);
      await Servico.findByIdAndUpdate(req.params.id, jsonServico);

      // CRIAR ARQUIVO
      if (arquivos.length > 0) {
        arquivos = arquivos.map((arquivo) => ({
          referenciaId: req.params.id,
          model: 'Servico',
          arquivo,
        }));
        await Arquivos.insertMany(arquivos);
      }

      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
});

/*
  FAZER NA #01
*/
router.get('/salao/:salaoId', async (req, res) => {
  try {
    let servicosSalao = [];
    const servicos = await Servico.find({
      salaoId: req.params.salaoId,
      status: { $ne: 'E' },
    });

    for (let servico of servicos) {
      const arquivos = await Arquivos.find({
        model: 'Servico',
        referenciaId: servico._id,
      });
      servicosSalao.push({ ...servico._doc, arquivos });
    }

    res.json({
      error: false,
      servicos: servicosSalao,
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

/*
  FAZER NA #01
*/
router.post('/remove-arquivo', async (req, res) => {
  try {
    const { arquivo } = req.body;
    const hasAws = aws.IAM_USER_KEY && aws.IAM_USER_SECRET && aws.BUCKET_NAME;

    // EXCLUIR DA AWS
    if (hasAws) {
      await aws.deleteFileS3(arquivo);
    }

    // EXCLUIR DO BANCO DE DADOS
    await Arquivos.findOneAndDelete({
      arquivo,
    });

    res.json({ error: false, message: 'Arquivo excluído com sucesso!' });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

/*
  FAZER NA #01
*/
router.delete('/:id', async (req, res) => {
  try {
    await Servico.findByIdAndUpdate(req.params.id, { status: 'E' });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
