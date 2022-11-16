const UserService = require('./user.service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('./../config/config')
const MailService = require('./mail.service');

const service = new UserService();
const serviceMail = new MailService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if(!user) {
      throw boom.notFound();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  signToken(user, secret = config.jwtSecret) {
    const payload = {
      sub: user.id,
      role: user.role
    };
    const token = jwt.sign(payload, secret);
    return {
      user,
      token
    }
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if(user.recoveryToken !== token) {
        throw boom.clientTimeout();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, { recoveryToken: null, password: hash });
      return { message: 'Password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async recoveryPassword(email) {
    const user = await service.findByEmail(email);
    if(!user) {
      throw boom.notFound();
    }
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `http://ariendahoy.com.co/recovery?=token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const res = await serviceMail.recoveryPassword(user, link);
    if(res) {
      return { message: "Mail sent" };
    } else {
      throw boom.badGateway();
    }
  }
}

module.exports = AuthService;
